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
    category = models.ForeignKey(Category, on_delete= models.CASCADE)
    price = models.PositiveSmallIntegerField()
    price_dryclean = models.PositiveSmallIntegerField(null = True)
    
    def __str__(self):
        return f"{self.text} - {self.category.text}"
    
    

