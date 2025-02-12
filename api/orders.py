
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.contrib.auth.models import User
from django.contrib.admin.views.decorators import staff_member_required
import datetime
from django.utils import timezone

import json
from .models import Address,Order,Price


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
