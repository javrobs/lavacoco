from django.urls import path
from . import views

urlpatterns = [
    path('login_user',views.login_user),
    path('signup',views.create_user),
    path('logout_user',views.logout_user),
    path('load_user',views.load_user),
    path('home_info/',views.home_info),
    path('price_info/',views.price_info),
    path('change_prices/',views.change_prices)
]

