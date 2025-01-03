from django.urls import path
from django.shortcuts import render,redirect
from django.middleware.csrf import get_token
from django.contrib.auth.decorators import login_required
from . import views

def main(request,*args):
    get_token(request)
    return render(request,"frontend/index.html")

@login_required
def all_users_only(request,*args):
    get_token(request)
    return render(request,"frontend/index.html")

def anonymous_only(request,*args):
    if request.user.is_anonymous:
        return render(request,"frontend/index.html")
    return redirect("/")

@login_required
def admin_only(request,*args):
    if request.user.is_superuser:
        return render(request,"frontend/index.html")
    return redirect("/")


@login_required
def users_only(request,*args):
    if not request.user.is_superuser:
        return render(request,"frontend/index.html")
    return redirect("/")




urls = [
    '',
    # 'servicios/',
    # 'nosotros/',
    'lista-de-precios/'
]

urls_anonymous_only = [
    'iniciar-sesion/',
    'crear-cuenta/'
]

urls_admin_only = [
    "crear-orden/"
]

urls_all_users_only = [
    # 'cliente-frecuente/',
    'configuracion/',
]

urls_users_only = [
    # 'mis-ordenes/',
    # 'invitar/'
]


urlpatterns = [*list(map(lambda x:path(x,main),urls)),
    *list(map(lambda x:path(x,all_users_only),urls_all_users_only)),
    *list(map(lambda x:path(x,admin_only),urls_admin_only)),
    *list(map(lambda x:path(x,anonymous_only),urls_anonymous_only)),
    *list(map(lambda x:path(x,users_only),urls_users_only))]

