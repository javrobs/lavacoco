from django.urls import path
from django.shortcuts import render

def main(request,*args):
    return render(request,"frontend/index.html")

urls = [
    '',
    'servicios/',
    'iniciar-sesion/',
    'crear-cuenta/',
    'nosotros/'
]


urlpatterns = list(map(lambda x:path(x,main),urls))

