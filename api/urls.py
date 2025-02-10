from django.urls import path
from . import views
from . import loaders

urlpatterns = [
    path('login_user/',views.login_user),
    path('signup/',views.create_user),
    path('logout_user/',views.logout_user),
    path('load_user/',views.load_user),
    path('create_client/',views.create_client),

    path('change_prices/',views.change_prices),

    path('create_order/',views.create_order),
    path('promote_order/',views.promote_order),
    path('save_payment_and_continue/',views.save_payment_and_continue),
    path('set_order_list/<int:order_id>',views.set_order_list),

    path('dryclean_payment/',views.dryclean_payment),

    path('spending_payment/',views.spending_payment),
    
    path('home_info/',loaders.home_info),
    path('faq_info/',loaders.faq_info),
    path('price_info/',loaders.price_info),
    path('create_order_info/',loaders.create_order_info),
    path('order_info/<int:order_id>',loaders.order_info),
    path('drycleaning_info/',loaders.drycleaning_info),
    path('drycleaning_info/<int:page>',loaders.drycleaning_info),
    path('reports_info/',loaders.reports_info),
    path('reports_info/<int:month>/<int:year>',loaders.reports_info),
    path('spending_info/',loaders.spending_info),
    path('spending_info/<int:page>',loaders.spending_info),
    path('laundry_machines_info',loaders.laundry_machines_info),
    path('laundry_machines_info/<int:day>/<int:month>/<int:year>',loaders.laundry_machines_info)
]

