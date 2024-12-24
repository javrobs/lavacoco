
from django.http import HttpResponse,JsonResponse
from django.views.decorators.http import require_POST
from django.contrib.auth.models import User
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
        return JsonResponse({"success": True})
    except json.JSONDecodeError:
        return JsonResponse({"success": False, "error": "Invalid JSON"}, status=400)

@require_POST
def create_user(request):
    try:
        json_data = json.loads(request.body)
        print(json_data)
        if User.objects.filter(username = json_data["phone"]).exists():
            return HttpResponse(status = 403, headers={"error_message": "El usuario ya existe"})
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


