
from django.http import HttpResponse,JsonResponse
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
from django.contrib.admin.views.decorators import staff_member_required
import datetime
from django.utils import timezone
from django.forms.models import model_to_dict

import json
import re
from .models import *


@require_POST
def login_user(request):
    try:
        json_data = json.loads(request.body)
        print(json_data)
        if not User.objects.filter(username = json_data['username']).exists():
            return JsonResponse({"success": False, "error": "El teléfono no se encontró"}, status=403)
        user = authenticate(request, username = json_data['username'], password = json_data['pw'])
        print(user)
        if user:
            login(request,user)
            return JsonResponse({"success": True})
        else:
            return JsonResponse({"success": False, "error": "La contraseña es incorrecta"}, status=403)
    except json.JSONDecodeError:
        return JsonResponse({"success": False, "error": "Invalid JSON"}, status=400)

@require_POST
def create_user(request, admin_created = False):
    try:
        json_data = json.loads(request.body)
        print(json_data)
        if User.objects.filter(username = json_data["username"]).exists():
            return JsonResponse({"success":False,"error": "El usuario ya existe"})
        user = User()
        if re.compile(r'[0-9]{10}').fullmatch(json_data.get("username")):
            user.username = json_data["username"]
        else:
            return JsonResponse({"success":False,"error": "Datos incompletos"}, status=400)
        if not admin_created:
            if json_data.get("password") and json_data.get("password_2") == json_data['password']:
                user.set_password(json_data['password'])
            else:
                return JsonResponse({"success":False,"error": "Error en la contraseña"}, status=403)
        for key in ["first_name","last_name"]:
            if json_data.get(key):
                setattr(user,key,json_data.get(key))
            else:
                return JsonResponse({"success":False,"error": "Datos incompletos"}, status=400)
        print(user,"user saved")
        user.save()
        address_keys = ["calle","colonia","numero_ext"]
        new_address = Address(user = user)
        for key in address_keys:
            if json_data.get(key) and new_address:
                setattr(new_address,key,json_data[key])
            else:
                new_address = None
                return JsonResponse({"success":True, 'user_id':user.id, 'address':False})
        address_keys_extra = ["numero_int","cp"]
        for key in address_keys_extra:
            if json_data.get(key):
                setattr(new_address,key,json_data[key])
        print(new_address)
        new_address.save()
        return JsonResponse({"success":True, 'user_id':user.id, "address":True})
    except Exception as e:
        print(e)
        return JsonResponse({"success": False, "error": str(e)}, status=500)


@login_required
def logout_user(request):
    user = request.user
    logout(request)
    return JsonResponse({"success": True,"user": user.first_name,"user_logged_out":request.user.is_authenticated})


def load_user(request):
    user = request.user
    if user.is_authenticated:
        print(user)
        return JsonResponse({"success":True,"logged_in":True,"superuser":user.is_superuser,"first_name":user.first_name,"last_name":user.last_name})
    return JsonResponse({"success":True,"logged_in":False})


@require_POST
@staff_member_required
def create_order(request):
    try:
        json_data = json.loads(request.body)
        print(json_data)
        result = {"success":True}
        user = User.objects.get(id = json_data["user"])
        if json_data.get("calle") and json_data.get("colonia") and json_data.get("numero_ext"):
            address = Address.objects.filter(user=user).first() or Address(user = user)
            for key in ["calle","colonia","numero_ext"]:
                if json_data.get(key):
                    setattr(address,key,json_data[key])
                else:
                    address = None
                    break
            if address:
                for key in ["numero_int","cp"]:
                    if json_data.get(key):
                        setattr(address,key,json_data[key])
                address.save()
        if json_data.get("deliver") and not Address.objects.filter(user=user).exists():
            return JsonResponse({"success":False, "error": "Falta la dirección del cliente"},status = 500)
        if datetime.datetime.strptime(json_data["date"],"%Y-%m-%d").date() < timezone.localdate():
            return JsonResponse({"success":False,"error":"Error en la fecha"},status = 500)
        new_order = Order(user = user,
                    date = json_data["date"],
                    pick_up_at_home = bool(json_data.get("deliver")),
                    priority = json_data.get("priority") or False)
        new_order.save()
        # result = {"users":list(User.objects.filter(is_staff=False).order_by("first_name").values("first_name","username","last_name","id"))} 
        return JsonResponse(result)
    except Exception as e:
        print(e)
        return JsonResponse({"success":False, "error":str(e)},status=500)

@require_POST
@staff_member_required
def promote_order(request):
    try:
        json_data = json.loads(request.body)
        order = Order.objects.get(id=json_data["id"])
        order.status += 1
        if order.status == 1:
            order.opened_datetime = timezone.now()
        if order.status>4 or order.status<0:
            return JsonResponse({"success":False, "error":"Fuera de rango"},status=500)
        order.save()
        return JsonResponse({"success":True})
    except Exception as e:
        print(e)
        return JsonResponse({"success":False, "error":"Failed"},status=500)
    

@require_POST
@staff_member_required
def create_client(request):
    return create_user(request,True)

@require_POST
@staff_member_required
def change_prices(request):
    try:
        json_data = json.loads(request.body)
        result = {"changed":[]}
        for key,data in json_data.items():
            [price_type,id] = key.split("-")
            price = Price.objects.get(id=id)
            if price_type == "tinto":
                price.price_dryclean = data
            elif price_type == "price":
                price.price = data
            price.save()
            result["changed"].append(key)
        result["success"] = True
        
        return JsonResponse(result)
    except Exception as e:
        print(e)
        return JsonResponse({"success": False, "error": str(e)}, status=500)
    
@require_POST
@staff_member_required
def set_order_list(request,order_id):
    try:
        order = Order.objects.get(id = order_id)
        json_data = json.loads(request.body)
        order_list = order.list_of_order_set
        order_list.all().delete()
        order.has_half = json_data['mediaCarga']
        for key,value in json_data['orderList'].items():
            price = Price.objects.get(id = key)
            order_list.create(concept = price, 
                              quantity = value["qty"], 
                              price_due = price.price, 
                              price_dryclean_due = price.price_dryclean)
        other_list = order.list_of_others_set
        other_list.all().delete()
        for other in json_data["others"]:
            if other.get("concept") and other.get("price"):
                other_list.create(concept = other['concept'], price = other['price'])
        order.tinto_others = json_data['othersTinto'] or 0
        order.save()
        return JsonResponse({"success":True})
    except Exception as e:
        print(e)
        return JsonResponse({"success":False, "error":str(e)},status=500)
    
@require_POST
@staff_member_required
def save_payment_and_continue(request):
    try:
        json_data = json.loads(request.body)
        order = Order.objects.get(id=json_data["id"])
        order.payment = True if json_data["payment"]=="tarjeta" else False
        order.status = 4
        total_tinto = order.tinto_movement()
        order.save()
        return JsonResponse({"success":True, "total_tinto":total_tinto})
    except Exception as e:
        print(e)
        return JsonResponse({"success":False, "error":str(e)},status=500)    
    
@require_POST
@staff_member_required
def dryclean_payment(request):
    try:
        json_data = json.loads(request.body)
        payment = int(json_data["payment"])
        owed_to_dryclean = -Dryclean_movements.get_total()
        if payment <= 0:
            return JsonResponse({"success":False, "error":"El pago debe ser mayor a 0"})
        if payment > owed_to_dryclean:
            return JsonResponse({"success":False, "error":f"El pago ({payment}) debe ser menor a la deuda a tintorería ({owed_to_dryclean})"})
        movement = Dryclean_movements(amount = payment)
        movement.save()
        return JsonResponse({"success":True, "payment_id":movement.id})
    except Exception as e:
        print(e)
        return JsonResponse({"success":False, "error":str(e)},status=500) 
    
    
@require_POST
@staff_member_required
def spending_payment(request):
    try:
        json_data = json.loads(request.body)
        print(json_data)
        payment = int(json_data["amount"])
        # owed_to_dryclean = -Dryclean_movements.get_total()
        if payment <= 0:
            return JsonResponse({"success":False, "error":"El pago debe ser mayor a 0"})
        # if payment > owed_to_dryclean:
        #     return JsonResponse({"success":False, "error":f"El pago ({payment}) debe ser menor a la deuda a tintorería ({owed_to_dryclean})"})

        movement = Spending_movements(amount = payment, category=json_data["category"], )
        movement.card_payment = bool(json_data.get('creditCard')) 
        movement.save()
        return JsonResponse({"success":True, "payment_id":movement.id})
    except Exception as e:
        print(e)
        return JsonResponse({"success":False, "error":str(e)},status=500) 