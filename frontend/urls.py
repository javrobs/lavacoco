from django.urls import path
from django.shortcuts import render,redirect
from django.contrib.auth.decorators import login_required
from . import views

def main(request,*args):
    return render(request,"frontend/index.html")

@login_required
def user_only(request,*args):
    return render(request,"frontend/index.html")



urls = [
    '',
    'servicios/',
    'iniciar-sesion/',
    'crear-cuenta/',
    'nosotros/'
]

urls_users_only = [
    'cliente-frecuente/'
]


urlpatterns = list(map(lambda x:path(x,main),urls))+list(map(lambda x:path(x,user_only),urls_users_only))

