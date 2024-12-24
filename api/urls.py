from django.urls import path
from . import views

urlpatterns = [
    path('', views.main),
    path('login_user',views.login_user),
    path('signup',views.create_user)
]

