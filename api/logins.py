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
            raise Exception("El teléfono no se encontró")
        user = authenticate(request, username = json_data['username'], password = json_data['pw'])
        print(user)
        if not user:
            raise Exception("La contraseña es incorrecta")
        login(request,user)
        return JsonResponse({"success": True})
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)

@require_POST
def create_user(request, admin_created = False, edit_self = False):
    try:
        json_data = json.loads(request.body)

        with transaction.atomic():

            if (edit_self and User.objects.filter(username=json_data["username"]).exclude(id=edit_self.id).exists()) or \
            (not edit_self and User.objects.filter(username = json_data["username"]).exists()):
                raise Exception(f"El usuario ya existe")
            
            if not re.compile(r'[0-9]{10}').fullmatch(json_data.get("username")):
                raise Exception(f"Error en el teléfono")
        
            user = edit_self or User(username=json_data["username"]) 
            
            if edit_self:
                user.username = json_data.get("username")

            if not admin_created and not edit_self:
                if len(json_data.get("password")) < 8 or len(json_data.get("password")) > 20 or json_data.get("password_2") != json_data['password']:
                    raise Exception(f"Error en la contraseña")
                user.set_password(json_data['password'])
                

            for key in ["first_name","last_name"]:
                if not json_data.get(key):
                    raise Exception(f"Datos incompletos")
                setattr(user,key,json_data.get(key))                
                
            user.save()

            if edit_self:
                edit_self.country_code_set.clear()
            
            country_code = json_data.get("countryCode")
            if country_code:
                try:
                    print("are you trying here",country_code)
                    country = Country_code.objects.get(id=country_code)
                    country.users.add(user)
                except Exception as e:
                    raise Exception(f"Error asignando país: {str(e)}")
            
            if edit_self:
                Address.objects.filter(user=edit_self).all().delete()
                
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
        return JsonResponse({"success":True,"logged_in":True,"superuser":user.is_superuser,"first_name":user.first_name,"last_name":user.last_name})
    return JsonResponse({"success":True,"logged_in":False})

@require_POST
@staff_member_required
def load_user_extra_password(request):
    try:
        user = request.user
        json_data = json.loads(request.body)
        password=json_data.get("password")
        if password != "260404":
            raise Exception("La contraseña es incorrecta")
        return JsonResponse({"success":True,"logged_in":True,"superuser":user.is_superuser,"first_name":user.first_name,"last_name":user.last_name,"extraPassword":True})
    except Exception as e:
        return JsonResponse({"success":False, "error":str(e)},status=500)


@require_POST
@staff_member_required
def create_client(request):
    return create_user(request,True)

@require_POST
@staff_member_required
def get_link_recover_password_admin(request,already_has_password = True):
    try:
        json_data = json.loads(request.body)
        user_id=json_data.get("selectUser")
        find_user = User.objects.get(id=user_id)
        if already_has_password and not find_user.password:
            raise Exception(f"{find_user.first_name} no tiene contraseña")
        elif not already_has_password and not find_user.password == "":
            raise Exception(f"{find_user.first_name} ya tiene contraseña")
        phone = Country_code.extend_phone(find_user)
        link = recover_password_admin(request,find_user) if already_has_password else invite_user_admin(request,find_user)
        message = f'Hola {find_user.first_name}, recupera tu contraseña aquí: {link}' if already_has_password else f'Hola {find_user.first_name}, te invito al sitio web de lavandería coco. Regístrate aquí: {link}'
        return JsonResponse({"success":True,
            "phone":phone,
            "link":link,
            "message":message})
    except Exception as e:
        return JsonResponse({"success":False, "error":str(e)},status=500)
    

@require_POST
@staff_member_required
def get_link_invite_admin(request):
    return get_link_recover_password_admin(request, False)
    
@require_POST
def set_recover_password(request,already_has_password = True):
    try:
        json_data = json.loads(request.body)
        user_id=json_data.get("userId")
        find_user = User.objects.get(id=user_id)

        if already_has_password and find_user.password == "":
            raise Exception("No existe una contraseña")
        elif not already_has_password and find_user.password:
            raise Exception("Ya existe una contraseña")
        
        if len(json_data.get("password")) < 8 or len(json_data.get("password")) > 20 or json_data.get("password") != json_data.get("password_2"):
            raise Exception("La contraseña falló.")
        
        find_user.set_password(json_data['password'])
        find_user.save()
        return JsonResponse({"success":True, "user_logged_in":find_user.id})

    except Exception as e:
        return JsonResponse({"success":False, "error":str(e)},status=500)
    
@require_POST
def add_password_admin_invite(request):
    return set_recover_password(request,False)

@require_POST
def edit_my_user(request):
    try:
        json_data = json.loads(request.body)
        user = User.objects.get(id=json_data["id"])
        if user == request.user:
            return create_user(request,False,user)
        else:
            raise Exception("Usuario incorrecto")
    except Exception as e:
        return JsonResponse({"succes":False,"error":str(e)},status=500) 
    
@require_POST
@login_required
def change_my_password(request):
    try:
        json_data = json.loads(request.body)
        print(json_data)
        user = request.user
        if not user.check_password(json_data['password']):
            raise Exception("La contraseña es incorrecta")    
        if len(json_data["new_password"]) < 8 or len(json_data.get("password")) > 20 or json_data["new_password"] != json_data["password_2"]:
            raise Exception("La nueva contraseña es incorrecta")   
        user.set_password(json_data["new_password"])
        user.save()
        login(request,user)
        return JsonResponse({"success":True})
    except Exception as e:
        return JsonResponse({"succes":False,"error":str(e)},status=500)   
    
@require_POST
@staff_member_required
def edit_user(request):
    try:
        json_data = json.loads(request.body)
        user = User.objects.get(id=json_data["id"])
        return create_user(request,False,user)
    except Exception as e:
        return JsonResponse({"succes":False,"error":str(e)},status=500) 