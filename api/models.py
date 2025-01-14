from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Address(models.Model):
    # User address for delivery
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    calle = models.TextField(max_length = 40)
    colonia = models.TextField(max_length = 40)
    numero_int = models.PositiveIntegerField(null = True)
    numero_ext = models.PositiveIntegerField()
    cp = models.PositiveIntegerField(null = True)

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
    price_dryclean = models.PositiveSmallIntegerField(null = True)
    
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
    has_half = models.BooleanField(default = False)
    pick_up_at_home = models.BooleanField(default = False)
    

class List_Of_Order(models.Model):
    order = models.ForeignKey(Order, on_delete = models.CASCADE)
    concept = models.ForeignKey(Price, on_delete=models.PROTECT)
    quantity = models.SmallIntegerField()


class FAQ(models.Model):
    question = models.TextField()
    answer = models.TextField()
    logged_only = models.BooleanField(default=False)


