from django.forms.models import model_to_dict
from django.db.models import Q
from django.http import JsonResponse
from .models import *
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.utils import timezone
from .jwt import invite_user_admin_decode, recover_password_decode, invite_user_friend, invite_user_friend_decode


def home_info(request, page = 1):
    user = request.user
    result = {}
    if user.is_anonymous:
        return JsonResponse({"success":True})
    if user.is_superuser:
        result = {"success":True}
        result["orders"] = [model_to_dict(order)|{"date":order.date_as_string(),"user":order.user.get_full_name(),"phone":Country_code.extend_phone(order.user)} for order in Order.objects.filter(status__lt=4).order_by("date")]
        return JsonResponse(result)
    else:
        result = {"success":True}
        result["user_link"] = invite_user_friend(request,user)
        result["ordenes_activas"] = [{"id":order.id,
            "price":order.earnings()-order.discounts(),
            "status":order.status,
            "date":order.date.strftime("%d-%m-%y"),
            "status_string":order.status_string()} for order 
            in user.order_set.filter(status__lt=4).order_by("-last_modified_at").all()]
        ordenes_pasivas = user.order_set.filter(status=4).order_by("-last_modified_at").all()
        paginator = Paginator(ordenes_pasivas,4)
        if page < 1:
            page = 1
        if page > paginator.num_pages:
            page = paginator.num_pages
        result["ordenes_pasivas"] = [{"id":order.id,
            "price":order.earnings() - order.discounts(),
            "status":order.status,
            "date":order.last_modified_at.strftime("%d-%m-%y"),
            "status_string":order.status_string()} for order 
            in paginator.get_page(page)]
        result['page'] = page
        result['num_pages'] = paginator.num_pages
        order_query = user.order_set.filter(status=4)
        result["cliente_freq"] = order_query.count() % 5
        if result["cliente_freq"] == 0:
            result["cliente_freq"] = 5 if order_query.exists() else 0
    return JsonResponse(result)


def signup_info(request, JWTCode = None, select_user = None):
    try:
        result = {"success":True}
        if JWTCode:
            ref_user = User.objects.get(id=invite_user_friend_decode(JWTCode)["user"])
            result["reference_user"] = {"id":ref_user.id,"name": ref_user.get_full_name()}
        if select_user:
            keys=['id','first_name','last_name','username']
            info = {key:getattr(select_user,key) for key in keys}
            country_code = Country_code.objects.filter(users = select_user).first()
            if country_code:
                info['countryCode'] = country_code.id
            address = Address.objects.filter(user = select_user).first()
            if address:
                keys=["calle","colonia","numero_int","numero_ext","cp"]
                for key in keys:
                    attribute = getattr(address,key)
                    if attribute:
                        info[key] = attribute
            result['select_user'] = {"info":info,"has_address":bool(address),"is_admin":select_user.is_superuser,"has_country_code":bool(country_code)}
        if not (select_user and select_user.is_superuser):
            result["codes"] = Country_code.all_country_codes()
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

@login_required
def config_info(request):
    if request.user.is_authenticated:
        return signup_info(request,None,request.user)
    return JsonResponse({"success":False},error=500)

@staff_member_required
def edit_user_info(request,user_id):
    if request.user.is_authenticated:
        find_user = User.objects.get(id=user_id)
        return signup_info(request,None,find_user)
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
            result["order"] = model_to_dict(order)|{"date":order.date_as_string(),"user":order.user.get_full_name(),"phone":Country_code.extend_phone(order.user),"status_name":order.status_string()}
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
            result["discounts_available"] = {
                "recs_invite": [{"id":reference.id, "type":"recs_invite", "text":f"Invitación de {reference.reference.get_full_name()}"} for reference in User_recommendation.objects.filter(invited=order.user).filter(Q(discount_invited=order)|Q(discount_invited__isnull=True)).all()], 
                "other_discounts": 
                    [{"id":reference.id, "type":"recs_reference", "text":f"Referencia de {reference.invited.get_full_name()}"} for reference in User_recommendation.objects.filter(reference=order.user,discount_invited__status=4).filter(Q(discount_reference=order)|Q(discount_reference__isnull=True)).all()] + \
                    [{"id":star.id, "type":"star", "text":"Cliente frecuente"} for star in Star_discount.objects.filter(user=order.user).filter(Q(order__isnull=True)|Q(order=order)).all()]
            }
            result["discounts_applied"] = \
                [{"id":reference.id, "type":"recs_invite", "text":f"Invitación de {reference.reference.get_full_name()}", "value":reference.value_invited} for reference in User_recommendation.objects.filter(discount_invited=order).all()] + \
                [{"id":reference.id, "type":"recs_reference", "text":f"Referencia de {reference.invited.get_full_name()}", "value":reference.value_reference} for reference in User_recommendation.objects.filter(discount_reference=order).all()] + \
                [{"id":star.id,"type":"star","text":"Cliente frecuente", "value":star.value} for star in Star_discount.objects.filter(order=order).all()]
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
    if page < 1:
        page = 1
    if page > paginator.num_pages:
        page = paginator.num_pages
    movements = [
        {"id":movement.id,
        "concept": movement.category,
        "paymentType": movement.payment_type,
        "due": movement.amount,
        "date": timezone.localdate(movement.created_at)} for movement in paginator.get_page(page)]
    return JsonResponse({"success": True, 
        "movements": movements, 
        "page": page,
        "num_pages": paginator.num_pages,
        "categories":cat})

@staff_member_required
def laundry_machines_info(request,day=None,month=None,year=None):
    result = {"success":True}
    try:
        result['dateSelected'] = datetime.date(day=day,month=month,year=year)
    except:
        result['dateSelected'] = timezone.localdate()
    result['dateBack'] = result['dateSelected'] - timezone.timedelta(days=1)
    if result['dateSelected'] < timezone.localdate():
        result['dateForward'] = result['dateSelected'] + timezone.timedelta(days=1)
    result['orders'] = [{"time":timezone.localtime(o.opened_datetime).strftime("%I:%M %p"),
               "id":o.id,
               "status":o.status_string(),
               "concept":f"Orden #{o.id} - {o.user.get_full_name()}"}for o in Order.objects.filter(opened_datetime__date=result['dateSelected']).order_by("opened_datetime").all()]
    return JsonResponse(result)

@staff_member_required
def clients_info(request):
    try:
        result = {"success":True}
        result["clients"] = [{"id":user.id,"name":user.get_full_name(),"has_password":bool(user.password)} for user in User.objects.filter(is_staff=False).order_by("first_name")]
        return JsonResponse(result) 
    except Exception as e:
        return JsonResponse({"success":False,"error":str(e)},status=400)

@staff_member_required
def closeout_info(request):
    result = {"success":True}
    result['orders']=[{"id":o.id,"text":o.user.get_full_name(),"earnings":o.earnings()-o.discounts()} for o in Order.objects.filter(status=4, last_modified_at__date=timezone.localdate(), card_payment=False).all()]
    result['gastos']=[{"id":spending.id,"text":spending.category,"amount":-spending.amount} for spending in Spending_movements.objects.filter(created_at__date=timezone.localdate(), card_payment=False).all()]
    result['dryclean_gastos']=[{"id":move.id,'amount':-move.amount} for move in  Dryclean_movements.objects.filter(amount__gte=0, created_at__date=timezone.localdate()).all()]
    return JsonResponse(result)