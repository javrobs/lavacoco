from django.http import JsonResponse
from django.views.decorators.http import require_POST  
from django.contrib.admin.views.decorators import staff_member_required  
from django.utils import timezone
import datetime

import json
from .models import Dryclean_movements,Spending_movements,Cutout

@require_POST
@staff_member_required
def dryclean_payment(request,edit=False):
    try:
        json_data = json.loads(request.body)
        owed_to_dryclean = -Dryclean_movements.get_total()
        if not json_data["amount"] or int(json_data["amount"]) <= 0:
            raise Exception("amount" if edit else "El pago debe ser mayor a 0")
        payment = int(json_data["amount"])
        movement = edit or Dryclean_movements()
        added_payment = payment - movement.amount if edit else payment
        if added_payment > owed_to_dryclean:
            raise Exception("amount" if edit else f"El pago ({payment}) debe ser menor a la deuda a tintorería ({owed_to_dryclean})")
        movement.amount = payment
        movement.save()
        return JsonResponse({"success":True, "payment_id":movement.id})
    except Exception as e:
        print(e)
        return JsonResponse({"success":False, "error":str(e)},status=500) 
    
    
@require_POST
@staff_member_required
def spending_payment(request,edit=False):
    try:
        json_data = json.loads(request.body)
        print(json_data)
        if not json_data["amount"] or int(json_data["amount"]) <= 0:
            raise Exception("amount" if edit else "El pago debe ser mayor a 0")
        movement = edit or Spending_movements() 
        movement.amount = json_data["amount"]
        if not json_data["concept"]:
            raise Exception("concept" if edit else "Selecciona una categoria")
        movement.category = json_data["concept"]
        movement.payment_type = json_data.get('paymentType') or 0
        movement.save()
        return JsonResponse({"success":True, "payment_id":movement.id})
    except Exception as e:
        print(e)
        return JsonResponse({"success":False, "error":str(e)},status=500) 
    
    
@require_POST
@staff_member_required
def edit_spending(request):
    try:
        json_data = json.loads(request.body)
        movement = Spending_movements.objects.get(id=json_data["id"])
        return spending_payment(request,movement)
    except Exception as e:
        print(e)
        return JsonResponse({"success":False, "error":str(e)},status=500) 

@require_POST
@staff_member_required
def edit_drycleaning(request):
    try:
        json_data = json.loads(request.body)
        movement = Dryclean_movements.objects.get(id=json_data["id"])
        return dryclean_payment(request, movement)
    except Exception as e:
        print(e)
        return JsonResponse({"success":False, "error":str(e)},status=500) 
        
@require_POST
@staff_member_required
def set_cutout(request):
    try:
        json_data = json.loads(request.body)
        print(json_data)
        if(datetime.datetime.strptime(json_data["date"],"%Y-%m-%d").date()!=timezone.localdate()):
            raise Exception("Date is wrong")
        if(int(json_data["amount"])<0):
            raise Exception("Amount is wrong")
        Cutout(amount_left=json_data["amount"]).save()
        return JsonResponse({"success":True})
    except Exception as e:
        return JsonResponse({"success":False, "error":str(e)},status=500) 