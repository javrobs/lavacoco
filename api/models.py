from django.db import models
from django.contrib.auth.models import User
from django.db.models import Sum, F
from datetime import date

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
    date_delivered = models.DateField(blank = True, null = True)
    status = models.IntegerField(choices = status_choices, default=0)
    has_half = models.BooleanField(default = False)
    pick_up_at_home = models.BooleanField(default = False)
    card_payment = models.BooleanField(default = False)
    tinto_others = models.IntegerField(blank = True, null = True)
    tinto_paid = models.BooleanField(default = False)
    
    def __str__(self):
        return f"Orden de {self.user.get_full_name()} - {self.date}"

    def days_left_string(self):
        week_days = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"]
        days_left = (self.date-date.today()).days
        immediate_days = ['Ayer','Hoy','Mañana']
        if abs(days_left)<=1:
            return immediate_days[days_left+1]
        if days_left>0 and days_left<7:
            return week_days[self.date.weekday()]
        word_to_use = "En" if days_left>0 else "Hace"
        return f"{word_to_use} {abs(days_left)} días" 
    
    def short_date(self):
        days_left = (self.date-date.today()).days
        week_days = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"]
        immediate_days = ['Ayer', 'Hoy', 'Mañana']
        if abs(days_left)<=1:
            return immediate_days[days_left+1]
        return f'{week_days[self.date.weekday()]}, {self.date.day}'
    
    def date_as_string(self):
        months = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"]
        return f'{self.date.day} de {months[self.date.month-1]} ({self.days_left_string()})'
    
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

class Dryclean_balance(models.Model):
    total = models.SmallIntegerField()
    updated_at = models.DateTimeField(auto_now=True)

    @staticmethod
    def get_total():
        try:
            return Dryclean_balance.objects.get(id=1).total
        except:
            return 0


    def __str__(self):
        return f"Total: {self.total}"

class List_Of_Order(models.Model):
    order = models.ForeignKey(Order, on_delete = models.CASCADE)
    concept = models.ForeignKey(Price, on_delete=models.PROTECT)
    price_due = models.SmallIntegerField()
    price_dryclean_due = models.SmallIntegerField()
    quantity = models.SmallIntegerField()

class List_Of_Others(models.Model):
    order = models.ForeignKey(Order, on_delete = models.CASCADE)
    concept = models.TextField(max_length=100)
    price = models.SmallIntegerField()


class FAQ(models.Model):
    question = models.TextField()
    answer = models.TextField()
    logged_only = models.BooleanField(default=False)


