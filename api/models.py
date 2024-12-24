from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Adress(models.Model):
    place = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    calle = models.TextField(max_length = 40, null = True)
    colonia = models.TextField(max_length = 40, null = True)
    numero_int = models.PositiveIntegerField(null = True)
    numero_ext = models.PositiveIntegerField(null = True)
    cp = models.PositiveIntegerField(null = True)

    