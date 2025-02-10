from django.shortcuts import render
from django.middleware.csrf import get_token
from django.contrib.auth.decorators import login_required
from django.shortcuts import render,redirect
from api.models import Order
from django.contrib.admin.views.decorators import staff_member_required

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

@staff_member_required
def admin_only(request,*args,**other):
    return render(request,"frontend/index.html")

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
    try:
        order = Order.objects.get(id=order_id)
        if request.user.is_superuser or order.user == request.user:
            return render(request,"frontend/index.html")
    except:
        return redirect("/")


