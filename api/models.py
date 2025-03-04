from django.db import models
from django.contrib.auth.models import User
from django.db.models import Sum, F
from datetime import date
from django.utils import timezone
from django.core.validators import MinValueValidator,MaxValueValidator
import datetime

# Create your models here.

class Address(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    calle = models.TextField(max_length = 40)
    colonia = models.TextField(max_length = 40)
    numero_int = models.PositiveIntegerField(blank = True, null = True)
    numero_ext = models.PositiveIntegerField()
    cp = models.PositiveIntegerField(blank = True, null = True)

    def __str__(self):
        return f"Dirección de {self.user.first_name}: {self.calle} {self.numero_ext}"


class Category(models.Model):
    text = models.TextField(max_length=40)
    def __str__(self):
        return f"Categoria {self.text}"


class Price(models.Model):
    text = models.TextField(max_length = 100)
    category = models.ForeignKey(Category, on_delete = models.CASCADE)
    price = models.PositiveSmallIntegerField()
    price_dryclean = models.PositiveSmallIntegerField(blank = True, null = True)
    
    def __str__(self):
        return f"{self.text} - {self.category.text}"
    

class Order(models.Model):
    class status_choices(models.IntegerChoices):
        NUEVA = 0
        ABIERTA = 1
        CERRADA = 2
        LISTA = 3
        TERMINADA = 4

    user = models.ForeignKey(User, on_delete = models.PROTECT)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add = True)
    priority = models.BooleanField(default = False)
    last_modified_at = models.DateTimeField(auto_now=True)
    status = models.IntegerField(choices = status_choices, default=0)
    has_half = models.SmallIntegerField(default = 0)
    pick_up_at_home = models.BooleanField(default = False)
    card_payment = models.BooleanField(default = False)
    tinto_others = models.IntegerField(blank = True, null = True)
    opened_datetime = models.DateTimeField(null = True)
    
    def __str__(self):
        return f"Orden {self.id} de {self.user.get_full_name()} - {self.date}"

    def days_left_string(self):
        week_days = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"]
        days_left = (self.date - timezone.localdate()).days
        immediate_days = ['Ayer','Hoy','Mañana']
        if abs(days_left)<=1:
            return immediate_days[days_left+1]
        if days_left>0 and days_left<7:
            return week_days[self.date.weekday()]
        word_to_use = "En" if days_left>0 else "Hace"
        return f"{word_to_use} {abs(days_left)} días" 
    
    def short_date(self):
        days_left = (self.date-timezone.localdate()).days
        week_days = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"]
        immediate_days = ['Ayer', 'Hoy', 'Mañana']
        if abs(days_left)<=1:
            return immediate_days[days_left+1]
        return f'{week_days[self.date.weekday()]}, {self.date.day}'
    
    def date_as_string(self):
        months = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"]
        return f'{self.date.day} de {months[self.date.month-1]} ({self.days_left_string()})'
    
    def discounts(self):
        invite_discounts = self.discountinvited.aggregate(Sum("value_invited"))["value_invited__sum"] or 0
        reference_discounts = self.discountreference.aggregate(Sum("value_reference"))["value_reference__sum"] or 0
        stars_discounts = self.star_discount_set.aggregate(Sum("value"))["value__sum"] or 0
        return invite_discounts + reference_discounts + stars_discounts

    def earnings(self):
        total = self.list_of_order_set.aggregate(total = Sum(F("price_due") * F("quantity")))["total"] or 0
        other_sum = self.list_of_others_set.aggregate(Sum("price"))["price__sum"] or 0

        return total + other_sum + self.has_half
    
    def status_string(self):
        status_ref = ["Nueva","En proceso","Confirmada","Lista","Terminada"]
        return status_ref[self.status]
    
    @staticmethod
    def earning_month_year(month,year):
        result = 0
        print(month,year)
        for each in Order.objects.filter(last_modified_at__month=month).filter(last_modified_at__year=year).all():
            result += each.earnings()
        return result
    
    def tinto_total(self):
        order_tinto_sum = self.list_of_order_set.aggregate(total = Sum(F("price_dryclean_due") * F("quantity")))["total"] or 0
        return (order_tinto_sum + self.tinto_others) * -1

    def tinto_movement(self):
        tinto_total = self.tinto_total()
        if tinto_total:
            self.dryclean_movements_set.create(amount = tinto_total)
        return tinto_total
    
    

class Dryclean_movements(models.Model):
    order = models.ForeignKey(Order, blank = True, null = True, on_delete = models.CASCADE)
    amount = models.SmallIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    @staticmethod
    def get_total():
        return Dryclean_movements.objects.all().aggregate(Sum("amount"))["amount__sum"]
    
    @staticmethod
    def spending_month_year(month,year):
        return Dryclean_movements.objects\
            .filter(amount__gt = 0)\
            .filter(created_at__month = month)\
            .filter(created_at__year = year)\
            .aggregate(Sum("amount"))["amount__sum"] or 0
    

class Spending_movements(models.Model):
    amount = models.SmallIntegerField()
    category = models.TextField(max_length=40)
    created_at = models.DateTimeField(auto_now_add = True)
    card_payment = models.BooleanField(default = False)
    

class List_Of_Order(models.Model):
    order = models.ForeignKey(Order, on_delete = models.CASCADE)
    concept = models.ForeignKey(Price, on_delete=models.PROTECT)
    price_due = models.SmallIntegerField()
    price_dryclean_due = models.SmallIntegerField()
    quantity = models.SmallIntegerField()

    @staticmethod
    def month_order_earnings(month,year):
        return list(List_Of_Order.objects\
            .filter(order__last_modified_at__month=month)\
            .filter(order__last_modified_at__year=year)\
            .annotate(cat=F("concept__category__text"),text=F("concept__text"))\
            .values("cat","text")\
            .annotate(total=Sum(F("price_due")*F("quantity"))))

class List_Of_Others(models.Model):
    order = models.ForeignKey(Order, on_delete = models.CASCADE)
    concept = models.TextField(max_length=100)
    price = models.SmallIntegerField()

class Half_Load_Price(models.Model):
    price = models.SmallIntegerField()

    @staticmethod
    def set_price(pass_price):
        half_load,_ = Half_Load_Price.objects.get_or_create(id=1,defaults={"price":pass_price})
        half_load.price = pass_price
        half_load.save()
        return True

    @staticmethod
    def get_price():
        try:
            return Half_Load_Price.objects.get(id=1).price
        except:
            return 0

class FAQ(models.Model):
    question = models.TextField()
    answer = models.TextField()
    logged_only = models.BooleanField(default=False)


class Country_code(models.Model):
    name = models.TextField(unique=True)
    phone = models.DecimalField(max_digits=3, decimal_places=0)
    unicode_1 = models.SmallIntegerField(validators=[MinValueValidator(62),MaxValueValidator(87)])
    unicode_2 = models.SmallIntegerField(validators=[MinValueValidator(62),MaxValueValidator(87)])
    users = models.ManyToManyField(User)

    @staticmethod
    def extend_phone(user):
        country_code_user = user.country_code_set.first()
        country_code_phone = str(country_code_user.phone) if country_code_user else "52"
        return str(country_code_phone) + str(user.username)
        
    @staticmethod
    def all_country_codes():
        return [{"id":country_code.id,
            "name":f"{country_code.name} (+{country_code.phone})",
            "code":country_code.codes()} for country_code in Country_code.objects.order_by("name").all()]

    def codes(self):
        return [127400 + self.unicode_1,127400 + self.unicode_2]
    
class User_recommendation(models.Model):
    invited = models.OneToOneField(User, related_name="invited",  on_delete=models.CASCADE)
    reference = models.ForeignKey(User, related_name="reference",  on_delete = models.CASCADE)
    discount_invited = models.ForeignKey(Order, related_name="discountinvited", blank= True,  null = True, on_delete = models.SET_NULL)
    discount_reference = models.ForeignKey(Order, related_name="discountreference", blank= True, null = True, on_delete = models.SET_NULL)
    value_invited = models.SmallIntegerField(blank= True, null = True)
    value_reference = models.SmallIntegerField(blank= True, null = True)

class Star_discount(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order = models.ForeignKey(Order, blank= True, null = True, on_delete=models.CASCADE)
    value = models.SmallIntegerField(blank= True, null = True)  