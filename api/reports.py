
from django.db.models import Sum, F, Count
from .models import *
import time
from django.http import JsonResponse
from django.contrib.admin.views.decorators import staff_member_required
from django.utils import timezone

month_names = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]


@staff_member_required
def month_year_info(request, month=timezone.localdate().month, year=timezone.localdate().year):
    try:
        start = time.time()
        result = {"success":True, 
            "report":{"labels":[],"parents":[],"values":[]}}
        total_earnings = 0
        total_discounts = 0
        total_spending = 0

        def append_three(label,value,parent):
            result["report"]["labels"].append(label)
            result["report"]["values"].append(value)
            result["report"]["parents"].append(parent)

        # Aggregate earnings by category
        for cat in Category.objects.all():
            cat_value = 0
            for price in cat.price_set.all():
                agg = price.list_of_order_set.filter(
                        order__status=4,
                        order__last_modified_at__month=month,
                        order__last_modified_at__year=year
                    ).aggregate(total=Sum(F("price_due")*F("quantity")),count=Sum("quantity"))
                if agg["total"]:
                    cat_value += agg["total"]
                    append_three(f" {price.text} ({agg['count']}) ",agg["total"],f" {cat.text} ")
            if cat.text == "Lavandería":
                total_medias_cargas = Order.objects.filter(
                    status=4,
                    last_modified_at__month=month,
                    last_modified_at__year=year
                ).aggregate(Sum("has_half"))["has_half__sum"]
                if total_medias_cargas:
                    cat_value += total_medias_cargas
                    append_three(" Media carga ",total_medias_cargas,f" {cat.text} ")
                
            if cat_value:
                total_earnings += cat_value
                append_three(f" {cat.text} ",cat_value," Entradas ")
        
        # Aggregate other earnings
        others_total = List_Of_Others.objects.filter(
                order__status=4,
                order__last_modified_at__month=month,
                order__last_modified_at__year=year
            ).aggregate(total=Sum(F("price")))["total"]

        if others_total:
            total_earnings += others_total
            append_three(" Otros ",others_total," Entradas ")

        if total_earnings:
            append_three(" Entradas ", total_earnings, f"{month_names[month - 1]} {year}")

        # Aggregate discounts
        discounts_invited = User_recommendation.objects.filter(
            discount_invited__status=4,
            discount_invited__last_modified_at__month=month,
            discount_invited__last_modified_at__year=year
        ).aggregate(Sum("value_invited"),Count("value_invited"))
        if discounts_invited["value_invited__sum"]:
            total_discounts += discounts_invited["value_invited__sum"]
            append_three(f" Invitados ({discounts_invited['value_invited__count']})",discounts_invited["value_invited__sum"]," Descuentos ")

        discounts_reference = User_recommendation.objects.filter(
            discount_reference__status=4,
            discount_reference__last_modified_at__month=month,
            discount_reference__last_modified_at__year=year
        ).aggregate(Sum("value_reference"),Count("value_reference"))
        if discounts_reference["value_reference__sum"]:
            total_discounts += discounts_reference["value_reference__sum"]
            append_three(f" Referencias ({discounts_reference['value_reference__count']})", discounts_reference["value_reference__sum"]," Descuentos ")

        discounts_stars = Star_discount.objects.filter(
            order__status=4,
            order__last_modified_at__month=month,
            order__last_modified_at__year=year
        ).aggregate(Sum("value"),Count("value"))
        print(discounts_stars)
        if discounts_stars["value__sum"]:
            total_discounts += discounts_stars["value__sum"]
            append_three(f" Cliente frecuente ({discounts_stars['value__count']}) ", discounts_stars["value__sum"]," Descuentos ")

        if total_discounts:
            append_three(" Descuentos ", total_discounts, f"{month_names[month - 1]} {year}")
        
        # Aggregate spending
        dryclean_spending = Dryclean_movements.spending_month_year(month,year)
        if dryclean_spending:
            total_spending += dryclean_spending
            append_three(" Tintorería  ",dryclean_spending," Salidas ")
        for movement in Spending_movements.objects.filter(created_at__month=month).filter(created_at__year=year).values("category").annotate(sum=Sum("amount")):
            total_spending += movement["sum"]
            append_three(f' {movement["category"]} ',movement["sum"]," Salidas ")
        if total_spending:
            append_three(" Salidas ",total_spending,f"{month_names[month - 1]} {year}")

        # Collect distinct dates
        fechas = list(
            set(Order.objects.filter(status=4).order_by("-last_modified_at").values_list("last_modified_at__month","last_modified_at__year").distinct()) | 
            set(Spending_movements.objects.order_by("-created_at").values_list("created_at__month","created_at__year").distinct()) | 
            set(Dryclean_movements.objects.order_by("-created_at").values_list("created_at__month","created_at__year").distinct())
        )

        result["dates"] = [[f"{m}/{y}",f"{month_names[m - 1]} {y}"] for m, y in fechas]
        result["report_date"] = f"{month}/{year}"
        result['time'] = time.time() - start
        
        return JsonResponse(result)
    except Exception as e:
        print(e)
        return JsonResponse({"success":False, "error":str(e)}, status=500)
    

@staff_member_required
def income_report_info(request):
    
    return JsonResponse({"success":True})
