from django.contrib import admin
from django.contrib import admin
from .models import *


class AddressAdmin(admin.ModelAdmin):
    list_display = ["calle","numero_ext"]

class PriceAdmin(admin.ModelAdmin):
    list_display = ["text","category__text"]

class CategoryAdmin(admin.ModelAdmin):
    list_display = ["text"]

class OrderAdmin(admin.ModelAdmin):
    list_display = ["id","user__first_name","user__last_name","date","has_half","tinto_others","created_at","last_modified_at","status","priority","pick_up_at_home","opened_datetime","card_payment"]

class ListOfOrderAdmin(admin.ModelAdmin):
    list_display = ["order","concept","quantity"]

class ListOfOthersAdmin(admin.ModelAdmin):
    list_display = ["order","concept","price"]

class FAQAdmin(admin.ModelAdmin):
    list_display = ["question","answer","logged_only"]

class MovementsAdmin(admin.ModelAdmin):
    list_display = ["amount","created_at","order"]

class SpendingAdmin(admin.ModelAdmin):
    list_display = ["amount","category","created_at","payment_type"]    

class CountriesAdmin(admin.ModelAdmin):
    list_display = ["id","name","phone","unicode_1","unicode_2"]

class RecommendationsAdmin(admin.ModelAdmin):
    list_display = ['invited__first_name','reference__first_name','discount_invited','discount_reference','value_invited','value_reference']

class StarAdmin(admin.ModelAdmin):
    list_display = ["user",'order','value']

class CutoutAdmin(admin.ModelAdmin):
    list_display = ["date", "amount_left"]

admin.site.register(Address,AddressAdmin)
admin.site.register(Price,PriceAdmin)
admin.site.register(Category,CategoryAdmin)
admin.site.register(Order,OrderAdmin)
admin.site.register(List_Of_Order,ListOfOrderAdmin)
admin.site.register(FAQ,FAQAdmin)
admin.site.register(List_Of_Others,ListOfOthersAdmin)
admin.site.register(Dryclean_movements,MovementsAdmin)
admin.site.register(Spending_movements,SpendingAdmin)
admin.site.register(Country_code,CountriesAdmin)
admin.site.register(User_recommendation,RecommendationsAdmin)
admin.site.register(Star_discount,StarAdmin)
admin.site.register(Cutout,CutoutAdmin)
# Register your models here.
