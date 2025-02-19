

from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.models import User
from django.views.decorators.http import require_POST
import json
from .jwt import invite_user_admin

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
        user.save()
        country_code = json_data.get("countryCode")
        print(country_code)
        if country_code:
            print(country_code)
            try:
                country = Country_code.objects.get(id=country_code)
                print(country)
                country.users.add(user)
                print(country.users.all())
            except Exception as e:
                return JsonResponse({"success":False,"error": str(e)}, status=500)
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
def create_client(request):
    return create_user(request,True)

@require_POST
@staff_member_required
def get_link_invite_admin(request):
    try:
        json_data = json.loads(request.body)
        user_id=json_data.get("selectUser")
        find_user = User.objects.get(id=user_id)
        return JsonResponse({"success":True, "link":invite_user_admin(request,find_user)})
    except Exception as e:
        return JsonResponse({"success":False, "error":str(e)},status=500)
    
@require_POST
def add_password_admin_invite(request):
    try:
        json_data = json.loads(request.body)
        print(json_data)
        user_id=json_data.get("userId")
        find_user = User.objects.get(id=user_id)
        if len(json_data.get("password")) >= 8 and json_data.get("password") == json_data.get("password_2"):
            find_user.set_password(json_data['password'])
            find_user.save()
            return JsonResponse({"success":True, "user_logged_in":find_user.id})
        else:
            return JsonResponse({"success":False,"error":"La contraseña falló."})
    except Exception as e:
        return JsonResponse({"success":False, "error":str(e)},status=500)
