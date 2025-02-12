from django.http import JsonResponse
import json
from .models import Price
from django.views.decorators.http import require_POST  
from django.contrib.admin.views.decorators import staff_member_required  


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