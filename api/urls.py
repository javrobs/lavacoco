from django.urls import path
from . import views
from . import loaders

urlpatterns = [
    path('login_user',views.login_user),
    path('signup',views.create_user),
    path('logout_user',views.logout_user),
    path('load_user',views.load_user),
    path('create_order/',views.create_order),
    path('change_prices/',views.change_prices),
    path('promote_order/',views.promote_order),
    
    path('home_info/',loaders.home_info),
    path('faq_info/',loaders.faq_info),
    path('price_info/',loaders.price_info),
    path('create_order_info/',loaders.create_order_info),
]

