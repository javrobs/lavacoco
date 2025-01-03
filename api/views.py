
from django.http import HttpResponse,JsonResponse
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
from django.forms.models import model_to_dict
from django.contrib.admin.views.decorators import staff_member_required

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
def create_user(request):
    try:
        json_data = json.loads(request.body)
        print(json_data)
        if User.objects.filter(username = json_data["username"]).exists():
            return JsonResponse({"success":False,"error": "El usuario ya existe"})
        user = User()
        # test
        # for key in needed_keys:
        #     if json_data.getattr(key) and (key != "username" or re.compile(r'[0-9]{10}').fullmatch(json_data[key])):
        if re.compile(r'[0-9]{10}').fullmatch(json_data.get("username")):
            user.username = json_data["username"]
        else:
            return JsonResponse({"success":False,"error": "Datos incompletos"}, status=400)
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
        new_address = Address(user=user)
        for key in address_keys:
            if json_data.get(key) and new_address:
                setattr(new_address,key,json_data[key])
            else:
                new_address = None
                return JsonResponse({"success":True, 'address':False})
        address_keys_extra = ["numero_int","cp"]
        for key in address_keys_extra:
            if json_data.get(key):
                setattr(new_address,key,json_data[key])
        print(new_address)
        new_address.save()
        return JsonResponse({"success":True, "address":True})
    except json.JSONDecodeError:
        print(e)
        return JsonResponse({"success": False, "error": "Invalid JSON"}, status=400)
    except KeyError as e:
        print(e)
        return JsonResponse({"success": False, "error": f"Missing field: {str(e)}"}, status=400)
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


def home_info(request):
    user = request.user
    result = {}
    if user.is_anonymous:
        return JsonResponse({"success":True,"user":"anonymous"})
    if user.is_superuser:
        return JsonResponse({"success":True,"user":"super_user"})
    else:
        result["user_link"] = "www.google.com.mx"
        result["orden_activa"] = False
        result["orden_pasada"] = []
        result["cliente_freq"] = 2
    return JsonResponse(result)

def price_info(request):
    admin = request.user.is_superuser
    result = {}
    lte = 4 if admin else 3
    list_of_prices = ['text','price','price_dryclean','id'] if admin else ['text','price']
    result["prices"] = [model_to_dict(cat)|{"prices":list(cat.price_set.values(*list_of_prices))} 
                            for cat in Category.objects.filter(id__lte=lte).all()]
    if admin:
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
    # if(each.id==4){
    #         const sabanas = [];
    #         const cobertores = [];
    #         const edredones = [];
    #         for(let price of each.prices){
    #             console.log(price)
    #             if(price.text.includes("Sábanas")){
    #                 sabanas.push(price)
    #             } else if(price.text.includes("Cobertor")){
    #                 cobertores.push({...price,text:price.text.split("-")[1]})
    #             } else {
    #                 edredones.push({...price,text:price.text.split("-")[1]})
    #             }
    #         }
    return JsonResponse(result)


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
    