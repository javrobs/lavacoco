from django.urls import path
from . import views

urlpatterns = [
    path('', views.main),
    path('login_user',views.login_user),
    path('signup',views.create_user),
    path('check_if_logged_in',views.check_if_logged_in),
    path('logout_user',views.logout_user),
    path('load_user',views.load_user)
]

