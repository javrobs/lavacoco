from django.http import JsonResponse
from django.views.decorators.http import require_POST  
from django.contrib.admin.views.decorators import staff_member_required  

import json
from .models import Dryclean_movements,Spending_movements

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
        if payment <= 0:
            return JsonResponse({"success":False, "error":"El pago debe ser mayor a 0"})
        movement = Spending_movements(amount = payment, category=json_data["category"], )
        movement.card_payment = bool(json_data.get('creditCard')) 
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
        print(json_data)
        payment = int(json_data["due"])
        if payment <= 0:
            return JsonResponse({"success":False, "error":"El pago debe ser mayor a 0"})
        movement = Spending_movements.objects.get(id=json_data["id"])
        movement.amount = payment
        movement.card_payment = bool(json_data.get('cardPayment')) 
        movement.save()
        return JsonResponse({"success":True, "payment_id":movement.id})
    except Exception as e:
        print(e)
        return JsonResponse({"success":False, "error":str(e)},status=500) 

@require_POST
@staff_member_required
def edit_drycleaning(request):
    try:
        json_data = json.loads(request.body)
        payment = int(json_data["due"])
        owed_to_dryclean = -Dryclean_movements.get_total()
        if payment <= 0:
            return JsonResponse({"success":False, "error":"El pago debe ser mayor a 0"})
        movement = Dryclean_movements.objects.get(id=json_data["id"])
        added_payment = payment - movement.amount 
        if added_payment > owed_to_dryclean:
            return JsonResponse({"success":False, "error":f"El pago ({payment}) debe ser menor a la deuda a tintorería ({owed_to_dryclean})"})
        movement.amount = payment
        movement.save()
        return JsonResponse({"success":True, "payment_id":movement.id})
    except Exception as e:
        print(e)
        return JsonResponse({"success":False, "error":str(e)},status=500) 