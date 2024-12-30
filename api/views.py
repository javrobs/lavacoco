
from django.http import HttpResponse,JsonResponse
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
import json

def main(request):
    response = {}
    response['test'] = [1,2,3,4]
    return JsonResponse(response)
# Create your views here.

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
        if User.objects.filter(username = json_data["phone"]).exists():
            return JsonResponse({"success":False,"error": "El usuario ya existe"})
        user = User.objects.create_user(username = json_data['phone'],
                                        first_name = json_data["name"],
                                        last_name = json_data["lastname"],
                                        password = json_data['pw'])
        return JsonResponse({"success":True})
    except json.JSONDecodeError:
        return JsonResponse({"success": False, "error": "Invalid JSON"}, status=400)
    except KeyError as e:
        return JsonResponse({"success": False, "error": f"Missing field: {str(e)}"}, status=400)
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)


def check_if_logged_in(request):
    print(request.user)
    if request.user.is_authenticated:
        return JsonResponse({"success": True, "user": request.user.first_name})
    return JsonResponse({"success": False})

@login_required
def logout_user(request):
    user = request.user
    logout(request)
    return JsonResponse({"success": True,"user": user.first_name,"user_logged_out":request.user.is_authenticated})


def load_user(request):
    user = request.user
    if user.is_authenticated:
        print(user)
        return JsonResponse({"success":True,"logged_in":True,"first_name":user.first_name,"last_name":user.last_name})
    return JsonResponse({"success":True,"logged_in":False})