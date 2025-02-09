

from django.forms.models import model_to_dict
from django.http import JsonResponse
from django.db.models import Sum, F
from .models import *
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.utils import timezone
import time

def home_info(request):
    user = request.user
    result = {}
    if user.is_anonymous:
        return JsonResponse({"success":True})
    if user.is_superuser:
        result = {"success":True}
        result["orders"] = [model_to_dict(order)|{"date":order.date_as_string(),"user":order.user.get_full_name(),"phone":order.user.username} for order in Order.objects.filter(status__lte=4).order_by("date")]
        result["status_strings"] = ["Nueva","Abierta","Cerrada","Lista","Terminada"]
        return JsonResponse(result)
    else:
        result["user_link"] = "www.google.com.mx"
        result["orden_activa"] = list(user.order_set.filter(status__lte=4).order_by("-created_at").values())
        result["orden_pasada"] = []
        order_query = Order.objects.filter(user=user)
        result["cliente_freq"] = order_query.count()%5
        if result["cliente_freq"] == 0:
            result["cliente_freq"] = 5 if order_query.exists() else 0
    return JsonResponse(result)


def price_info(request):
    admin = request.user.is_superuser 
    result = {}
    categories = Category.objects.all() if admin else Category.objects.filter(id__lte=3).all()
    list_of_prices = ['text','price','price_dryclean','id'] if admin else ['text','price']
    result["prices"] = [model_to_dict(cat)|{"prices":list(cat.price_set.values(*list_of_prices))} 
                            for cat in categories]
    if admin:
        return JsonResponse(result)
    bed = model_to_dict(Category.objects.get(id=4))|{"Sábana":[],"Cobertor":[],"Edredón":[]}
    for p in Price.objects.filter(category=4).values("text","price"):
        for key in ["Sábana","Cobertor","Edredón"]:
            if key in p['text']:
                if "-" in p["text"]:
                    p["text"] = p["text"].split("-")[1]
                bed[key].append(p)
                break
    result["prices"].append(bed)
    return JsonResponse(result)

@staff_member_required
def create_order_info(request):
    result = {}
    result["users"] = list(User.objects.filter(is_staff=False).order_by("first_name").values("first_name","last_name","id"))
    for u in result["users"]:
        if Address.objects.filter(user=u["id"]).all():
            u["address"] = model_to_dict(Address.objects.get(user=u["id"]))
    return JsonResponse(result)

def faq_info(request):
    result = {"success":True}
    result["questions"] = [model_to_dict(each) for each in FAQ.objects.all()]
    return JsonResponse(result)

@login_required
def order_info(request,order_id):
    try:
        order = Order.objects.get(id=order_id)
        admin = request.user.is_superuser
        if admin or order.user == request.user:
            result = {"success":True}
            result["order"] = model_to_dict(order)|{"date":order.date_as_string(),"user":order.user.get_full_name(),"phone":order.user.username}
            result["order_list"] = {item.concept.id:{"qty":item.quantity,"price_due":item.price_due,"price_dryclean_due":item.price_dryclean_due} for item in order.list_of_order_set.all()}
            list_of_prices = ['text','price','price_dryclean','id']
            result["prices"] = {cat.id:{
                "name":cat.text,
                "prices":
                    {price["id"]:price 
                    for price in (cat.price_set.values(*list_of_prices))}
                }
                for cat in Category.objects.all()
            }
            result["others_tinto"] = order.tinto_others or 0
            result["others_start"] = list(order.list_of_others_set.values("concept","price"))
            return JsonResponse(result)
        else:
            return JsonResponse({"success":False,"error":"Not authorized"},status=500)
    except Exception as e:
        print(e)
        return JsonResponse({"success":False,"error":str(e)},status=404)
    
@staff_member_required
def drycleaning_info(request, page = 1):
    movements = Dryclean_movements.objects.all().order_by("-id")
    paginator = Paginator(movements, 15)
    if page < 1:
        page = 1
    if page > paginator.num_pages:
        page = paginator.num_pages
    movements = [
        {"id": movement.order.id if movement.order else None,
        "concept": f"Orden #{movement.order.id} - {movement.order.user.get_full_name()}" if movement.order else 'Pago',
        "due": movement.amount,
        "date": timezone.localdate(movement.created_at)} for movement in paginator.get_page(page)]
    return JsonResponse({"success": True, 
        "movements": movements, 
        "page": page,
        "num_pages": paginator.num_pages,
        "total": Dryclean_movements.get_total()})

@staff_member_required
def reports_info(request, month=timezone.localdate().month, year=timezone.localdate().year):
    try:
        start = time.time()
        result = {"success":True}
        result['earnings'] = Order.earning_month_year(month,year)
        result['spending'] = {**{"Tintorería": Dryclean_movements.spending_month_year(month,year)},
                              **{movement["category"]: movement["amount__sum"] for movement in Spending_movements.objects.filter(created_at__month=month).filter(created_at__year=year).values("category").annotate(Sum("amount")) or []}
                              }
        result['orders'] = [{order.id:order.earnings()} for order in Order.objects.filter(date_delivered__month=month).filter(date_delivered__year=year).all()]
        result['time'] = time.time() - start
        print(month,year)
        return JsonResponse(result)
    except Exception as e:
        print(e)
        return JsonResponse({"success":False, "error":str(e)},status=500)


@staff_member_required
def spending_info(request,page=1):
    cat = [each["category"] for each in Spending_movements.objects.values("category").distinct().all()]
    movements = Spending_movements.objects.all().order_by("-id")
    paginator = Paginator(movements, 15)
    if page < 1:
        page = 1
    if page > paginator.num_pages:
        page = paginator.num_pages
    movements = [
        {"id": None,
        "concept": movement.category,
        "due": movement.amount,
        "date": timezone.localdate(movement.created_at)} for movement in paginator.get_page(page)]
    return JsonResponse({"success": True, 
        "movements": movements, 
        "page": page,
        "num_pages": paginator.num_pages,
        "categories":cat})