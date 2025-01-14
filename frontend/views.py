from django.shortcuts import render
from django.middleware.csrf import get_token
from django.contrib.auth.decorators import login_required
from django.shortcuts import render,redirect

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
def admin_only(request,*args):
    if request.user.is_superuser:
        return render(request,"frontend/index.html")
    return redirect("/")


@login_required
def users_only(request,*args):
    if not request.user.is_superuser:
        return render(request,"frontend/index.html")
    return redirect("/")
