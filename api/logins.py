from django.db import transaction
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.models import User
from django.views.decorators.http import require_POST
import json
from .jwt import invite_user_admin,recover_password_admin

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

        with transaction.atomic():

            if User.objects.filter(username = json_data["username"]).exists():
                raise Exception(f"El usuario ya existe")
            
            if not re.compile(r'[0-9]{10}').fullmatch(json_data.get("username")):
                raise Exception(f"Error en el teléfono")
        
            user = User(username=json_data["username"]) 
            
            if not admin_created:
                if len(json_data.get("password")) >= 8 and json_data.get("password_2") == json_data['password']:
                    user.set_password(json_data['password'])
                else:
                    raise Exception(f"Error en la contraseña")
                
            for key in ["first_name","last_name"]:
                if json_data.get(key):
                    setattr(user,key,json_data.get(key))
                else:
                    raise Exception(f"Datos incompletos")
                
            user.save()

            country_code = json_data.get("countryCode")
            if country_code:
                try:
                    country = Country_code.objects.get(id=country_code)
                    country.users.add(user)
                except Exception as e:
                    raise Exception(f"Error asignando país: {str(e)}")
                
            address_keys = ["calle","colonia","numero_ext"]
            new_address = Address(user = user)
            for key in address_keys:
                if json_data.get(key) and new_address:
                    setattr(new_address,key,json_data[key])
                else:
                    new_address = None
                    break

            if new_address:
                address_keys_extra = ["numero_int","cp"]
                for key in address_keys_extra:
                    if json_data.get(key):
                        setattr(new_address,key,json_data[key])
                new_address.save()

            reference = json_data.get("reference_user_id")
            if reference:
                try:
                    new_reference = User_recommendation(
                        invited=user,
                        reference=User.objects.get(id=reference)
                    )
                    new_reference.save()
                except User.DoesNotExist:
                    raise Exception("No existe el usuario de referencia")

            return JsonResponse({"success": True,
                'user_id': user.id,
                "address": bool(new_address),
                "country_code": bool(country_code),
                "reference": bool(reference)})
                
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
def create_client(request):
    return create_user(request,True)

@require_POST
@staff_member_required
def get_link_invite_admin(request):
    try:
        json_data = json.loads(request.body)
        user_id=json_data.get("selectUser")
        find_user = User.objects.get(id=user_id)
        if find_user.password == "":
            phone = Country_code.extend_phone(find_user)
            link = invite_user_admin(request,find_user)
            return JsonResponse({"success":True, 
                                "link":link,
                                "phone":phone,
                                "message":f'Hola {find_user.first_name}, te invito al sitio web de lavandería coco. Regístrate aquí: {link}'})
        
        return JsonResponse({"success":False, "error":f"{find_user.first_name} ya tiene contraseña"},status=500)
    except Exception as e:
        return JsonResponse({"success":False, "error":str(e)},status=500)
    

@require_POST
@staff_member_required
def get_link_recover_password_admin(request):
    try:
        json_data = json.loads(request.body)
        user_id=json_data.get("selectUser")
        find_user = User.objects.get(id=user_id)
        phone = Country_code.extend_phone(find_user)
        if find_user.password:
            link = recover_password_admin(request,find_user)
            return JsonResponse({"success":True,
                                "phone":phone,
                                "link":recover_password_admin(request,find_user),
                                "message":f'Hola {find_user.first_name}, recupera tu contraseña aquí: {link}'})
        return JsonResponse({"success":False, "error":f"{find_user.first_name} no tiene contraseña"},status=500)
    except Exception as e:
        return JsonResponse({"success":False, "error":str(e)},status=500)
    
@require_POST
def add_password_admin_invite(request):
    try:
        json_data = json.loads(request.body)
        print(json_data)
        user_id=json_data.get("userId")
        find_user = User.objects.get(id=user_id)
        if find_user.password:
            return JsonResponse({"success":False, "error": "Ya existe una contraseña"},status=400)
        if len(json_data.get("password")) >= 8 and json_data.get("password") == json_data.get("password_2"):
            find_user.set_password(json_data['password'])
            find_user.save()
            return JsonResponse({"success":True, "user_logged_in":find_user.id})
        else:
            return JsonResponse({"success":False,"error":"La contraseña falló."},status=400)
    except Exception as e:
        return JsonResponse({"success":False, "error":str(e)},status=500)

    
@require_POST
def set_recover_password(request):
    try:
        json_data = json.loads(request.body)
        print(json_data)
        user_id=json_data.get("userId")
        find_user = User.objects.get(id=user_id)
        if find_user.password == "":
            return JsonResponse({"success":False, "error": "No existe una contraseña"},status=400)
        if len(json_data.get("password")) >= 8 and json_data.get("password") == json_data.get("password_2"):
            find_user.set_password(json_data['password'])
            find_user.save()
            return JsonResponse({"success":True, "user_logged_in":find_user.id})
        else:
            return JsonResponse({"success":False,"error":"La contraseña falló."})
    except Exception as e:
        return JsonResponse({"success":False, "error":str(e)},status=500)