from django.shortcuts import render
from django.middleware.csrf import get_token
from django.contrib.auth.decorators import login_required
from django.shortcuts import render,redirect
from api.models import Order

# Create your views here.

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
def admin_only(request,*args,**other):
    if request.user.is_superuser:
        return render(request,"frontend/index.html")
    return redirect("/")

@login_required
def admin_only_report(request,month,year):
    if request.user.is_superuser:
        return render(request,"frontend/index.html")
    return redirect("/")

@login_required
def users_only(request,*args):
    if not request.user.is_superuser:
        return render(request,"frontend/index.html")
    return redirect("/")

@login_required
def order(request,order_id):
    if request.user.is_superuser or Order.objects.filter(user=request.user).filter(id=order_id).first():
        return render(request,"frontend/index.html")
    return redirect("/")
