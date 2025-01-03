from django.contrib import admin
from django.contrib import admin
from .models import Address,Price,Category


class AddressAdmin(admin.ModelAdmin):
    list_display = ["calle","numero_ext"]

class PriceAdmin(admin.ModelAdmin):
    list_display = ["text","category__text"]

class CategoryAdmin(admin.ModelAdmin):
    list_display = ["text"]


admin.site.register(Address,AddressAdmin)
admin.site.register(Price,PriceAdmin)
admin.site.register(Category,CategoryAdmin)
# Register your models here.
