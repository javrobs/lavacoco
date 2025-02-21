from django.forms.models import model_to_dict
from django.http import JsonResponse
from .models import *
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.utils import timezone
from .jwt import invite_user_admin_decode, recover_password_decode, invite_user_friend, invite_user_friend_decode


def home_info(request):
    user = request.user
    result = {}
    if user.is_anonymous:
        return JsonResponse({"success":True})
    if user.is_superuser:
        result = {"success":True}
        result["orders"] = [model_to_dict(order)|{"date":order.date_as_string(),"user":order.user.get_full_name(),"phone":Country_code.extend_phone(order.user)} for order in Order.objects.filter(status__lte=4).order_by("date")]
        result["status_strings"] = ["Nueva","Abierta","Cerrada","Lista","Terminada"]
        return JsonResponse(result)
    else:
        result["user_link"] = invite_user_friend(request,user)
        result["orden_activa"] = list(user.order_set.filter(status__lte=4).order_by("-created_at").values())
        result["orden_pasada"] = []
        order_query = Order.objects.filter(user=user)
        result["cliente_freq"] = order_query.count()%5
        if result["cliente_freq"] == 0:
            result["cliente_freq"] = 5 if order_query.exists() else 0
    return JsonResponse(result)


def signup_info(request,JWTCode=None):
    try:
        result = {"success":True,"codes":Country_code.all_country_codes()}
        if JWTCode:
            ref_user = User.objects.get(id=invite_user_friend_decode(JWTCode)["user"])
            result["reference_user"] = {"id":ref_user.id,"name": ref_user.get_full_name()}
        return JsonResponse(result)
    except Exception as e:
        return JsonResponse({"success":False,"error":str(e)},status=500)
    
    
def signup_admin_invite_info(request,JWTInvite):
    if request.user.is_anonymous:
        try:
            result = {"success":True}
            decode = invite_user_admin_decode(JWTInvite)
            if decode["expired"]:
                result["expired"] = True
                return JsonResponse(result)
            user = User.objects.get(id=decode["user"])
            if user.password:
                return JsonResponse({"success":False,"error":"El usuario ya tiene contraseña"},error=500)
            result["user_info"] = {"first_name":user.first_name,
                    "last_name": user.last_name,
                    "username":user.username,
                    "id":user.id}
            return JsonResponse(result)
        except Exception as e:
            print(e)
            return JsonResponse({"success":False,"error":str(e)},error=500)
    return JsonResponse({"success":False},error=500)

def recover_pw_info(request,JWTInvite):
    if request.user.is_anonymous:
        try:
            result = {"success":True}
            decode = recover_password_decode(JWTInvite)
            if decode["expired"]:
                result["expired"] = True
                return JsonResponse(result)
            user = User.objects.get(id=decode["user"])
            if user.password == "":
                return JsonResponse({"success":False,"error":"El usuario no tiene contraseña"},error=500)
            result["user_info"] = {"first_name":user.first_name,
                    "last_name": user.last_name,
                    "username":user.username,
                    "id":user.id}
            return JsonResponse(result)
        except Exception as e:
            print(e)
            return JsonResponse({"success":False,"error":str(e)},error=500)
    return JsonResponse({"success":False},error=500)

def price_info(request):
    admin = request.user.is_superuser 
    result = {}
    categories = Category.objects.all() if admin else Category.objects.filter(id__lte=3).all()
    list_of_prices = ['text','price','price_dryclean','id'] if admin else ['text','price']
    result["prices"] = [model_to_dict(cat)|{"prices":list(cat.price_set.values(*list_of_prices))} 
                            for cat in categories]
    if admin:
        result["prices"][0]['prices'].append({"text":"Media carga","price":Half_Load_Price.get_price(),"price_dryclean":0,"id":"mc"})
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
            result["order"] = model_to_dict(order)|{"date":order.date_as_string(),"user":order.user.get_full_name(),"phone":Country_code.extend_phone(order.user)}
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
            result["half_price"] = Half_Load_Price.get_price()
            result["others_tinto"] = order.tinto_others or 0
            result["others_start"] = list(order.list_of_others_set.values("concept","price"))

            result["discounts"] = [{"id":order.user.invited.id, "type":"invited"}] if User_recommendation.objects.filter(invited=order.user).exists() else []
            result["discounts"] += [{"id":reference.id, "type":"reference"} for reference in order.user.reference.filter(discount_invited__status=4).all()]
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
        {"id": movement.id,
         "id_order": movement.order.id if movement.order else None,
        "concept": f"Orden #{movement.order.id} - {movement.order.user.get_full_name()}" if movement.order else 'Pago',
        "due": movement.amount,
        "date": timezone.localdate(movement.created_at)} for movement in paginator.get_page(page)]
    return JsonResponse({"success": True, 
        "movements": movements, 
        "page": page,
        "num_pages": paginator.num_pages,
        "total": Dryclean_movements.get_total()})


@staff_member_required
def spending_info(request,page=1):
    cat = [each["category"] for each in Spending_movements.objects.values("category").distinct().all()]
    movements = Spending_movements.objects.all().order_by("-id")
    paginator = Paginator(movements, 15)
    print([thing for thing in paginator.get_page(1)])
    if page < 1:
        page = 1
    if page > paginator.num_pages:
        page = paginator.num_pages
    movements = [
        {"id":movement.id,
        "concept": movement.category,
        "cardPayment": movement.card_payment,
        "due": movement.amount,
        "date": timezone.localdate(movement.created_at)} for movement in paginator.get_page(page)]
    return JsonResponse({"success": True, 
        "movements": movements, 
        "page": page,
        "num_pages": paginator.num_pages,
        "categories":cat})

@staff_member_required
def laundry_machines_info(request,day=None,month=None,year=None):
    try:
        dateQuery = datetime.date(day=day,month=month,year=year) if day and month and year else timezone.localdate()
    except:
        dateQuery = timezone.localdate()
    def AM_PM(time):
        hours = time.hour
        minutes = str(100 + time.minute)[1:]
        return f"{hours if hours <= 12 else hours - 12}:{minutes} {'PM' if hours >= 2 else 'AM'}"
    orders = [{"time":AM_PM(timezone.localtime(o.opened_datetime)),
               "id":o.id,
               "status":o.status_string(),
               "concept":f"Orden #{o.id} - {o.user.get_full_name()}"}for o in Order.objects.filter(opened_datetime__date=dateQuery).order_by("opened_datetime").all()]
    return JsonResponse({"success":True,"orders": orders,"dateSelected":dateQuery})

@staff_member_required
def clients_info(request):
    try:
        result = {"success":True}
        result["clients"] = [{"id":user.id,"name":user.get_full_name(),"has_password":bool(user.password)} for user in User.objects.filter(is_staff=False).order_by("first_name")]
        return JsonResponse(result) 
    except Exception as e:
        return JsonResponse({"success":False,"error":str(e)},status=400)
