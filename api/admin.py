from django.contrib import admin
from django.contrib import admin
from .models import Address,Price,Category,Order,List_Of_Order,List_Of_Others,FAQ,Dryclean_movements,Dryclean_balance


class AddressAdmin(admin.ModelAdmin):
    list_display = ["calle","numero_ext"]

class PriceAdmin(admin.ModelAdmin):
    list_display = ["text","category__text"]

class CategoryAdmin(admin.ModelAdmin):
    list_display = ["text"]

class OrderAdmin(admin.ModelAdmin):
    list_display = ["id","user__first_name","user__last_name","date","created_at","last_modified_at","status","priority","pick_up_at_home","date_delivered"]

class ListOfOrderAdmin(admin.ModelAdmin):
    list_display = ["order","concept","quantity"]

class ListOfOthersAdmin(admin.ModelAdmin):
    list_display = ["order","concept","price"]

class FAQAdmin(admin.ModelAdmin):
    list_display = ["question","answer","logged_only"]

class MovementsAdmin(admin.ModelAdmin):
    list_display = ["amount","created_at","order"]
    
class TotalDrycleanAdmin(admin.ModelAdmin):
    list_display = ["id","total"]

admin.site.register(Address,AddressAdmin)
admin.site.register(Price,PriceAdmin)
admin.site.register(Category,CategoryAdmin)
admin.site.register(Order,OrderAdmin)
admin.site.register(List_Of_Order,ListOfOrderAdmin)
admin.site.register(FAQ,FAQAdmin)
admin.site.register(List_Of_Others,ListOfOthersAdmin)
admin.site.register(Dryclean_movements,MovementsAdmin)
admin.site.register(Dryclean_balance,TotalDrycleanAdmin)
# Register your models here.
