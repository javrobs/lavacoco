
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.contrib.auth.models import User
from django.contrib.admin.views.decorators import staff_member_required
import datetime
from django.utils import timezone
from django.db import transaction

import json
from .models import Address,Order,Price,User_recommendation,Star_discount
from .jwt import root_url,invite_user_admin


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
            raise Exception("Falta la dirección del cliente")
        if datetime.datetime.strptime(json_data["date"],"%Y-%m-%d").date() < timezone.localdate():
            raise Exception("Error en la fecha")
        if Order.objects.filter(id=json_data["noteID"]).exists():
            raise Exception("El número de nota ya existe")
        new_order = Order(user = user,
                    id = json_data["noteID"],
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
        with transaction.atomic():
            order = Order.objects.get(id = order_id)
            json_data = json.loads(request.body)
            order_list = order.list_of_order_set
            order_list.all().delete()
            order.has_half = json_data['mediaCarga']
            for discount in order.discountinvited.all():
                discount.discount_invited = None
                discount.save()
            for discount in order.discountreference.all():
                discount.discount_reference = None
                discount.save()
            set_value = Price.objects.get(id=1).price
            for discount in json_data['discountsApplied']:
                if discount["type"] == "recs_reference":
                    rec=User_recommendation.objects.get(id=discount["id"])
                    rec.discount_reference = order
                    rec.value_reference = set_value
                    rec.save()
                elif discount["type"] == "recs_invite":
                    rec=User_recommendation.objects.get(id=discount["id"])
                    rec.discount_invited = order
                    rec.value_invited = set_value
                    rec.save()
                elif discount["type"] == "star":
                    star=Star_discount.objects.get(id=discount["id"])
                    star.order = order
                    star.value = set_value
                    star.save()
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
            result = {"success":True}
            if "set_order_list_get_message" in request.path:
                result["message"] = f'Hola {order.user.first_name}, el total de tu orden es de ${order.earnings() - order.discounts()}. Te avisaremos cuando tu ropa esté lista. '
                result["message"] += f'Te invito al sitio web de lavandería coco. Regístrate aquí: {invite_user_admin(request,order.user)}' if order.user.password == "" else f"Puedes revisar más detalles en: {root_url(request)}/orden/{order.id}/"
            return JsonResponse(result)
    except Exception as e:
        print(e)
        return JsonResponse({"success":False, "error":str(e)},status=500)
    
@require_POST
@staff_member_required
def save_payment_and_continue(request):
    try:
        json_data = json.loads(request.body)
        order = Order.objects.get(id=json_data["id"])
        order.card_payment = True if json_data["payment"]=="tarjeta" else False
        order.status = 4
        total_tinto = order.tinto_movement()
        order.save()
        order_count = order.user.order_set.filter(status=4).count()
        if not order_count % 5:
            order.user.star_discount_set.create()
        return JsonResponse({"success":True, "total_tinto":total_tinto})
    except Exception as e:
        print(e)
        return JsonResponse({"success":False, "error":str(e)},status=500)    


@staff_member_required
def clothes_ready_message(request,order_id):
    try:
        response = {"success":True}
        order = Order.objects.get(id=order_id)
        user = order.user
        response["message"] = f"Hola {user.first_name}, "
        response["message"] += "tu ropa está lista. " if order.status == 2 else "te recordamos que tu ropa está lista. "
        response["message"] += f'Te invito al sitio web de lavandería coco. Regístrate aquí: {invite_user_admin(request,user)}' if user.password == "" else f"Puedes ver los detalles aquí: {root_url(request)}/orden/{order.id}/"
        return JsonResponse(response)
    except Exception as e:
        print(e)
        return JsonResponse({"success":False},status=500)
    
@staff_member_required
@require_POST
def delete_order(request):
    try:
        json_data = json.loads(request.body)
        print(json_data)
        if(json_data["matchValue"]==json_data["matchInput"]):
            order_to_delete = Order.objects.get(id=json_data["id"])
            order_to_delete.status = 5
            order_to_delete.save()
        return JsonResponse({"success":True})
    except Exception as e:
        print(e)
        return JsonResponse({"success":False},status=500)