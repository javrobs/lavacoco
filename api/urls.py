from django.urls import path
from . import orders
from . import loaders
from . import logins
from . import payments
from . import prices

urlpatterns = [
    path('login_user/',logins.login_user),
    path('signup/',logins.create_user),
    path('logout_user/',logins.logout_user),
    path('load_user/',logins.load_user),
    path('create_client/',logins.create_client),

    path('change_prices/',prices.change_prices),

    path('create_order/',orders.create_order),
    path('promote_order/',orders.promote_order),
    path('save_payment_and_continue/',orders.save_payment_and_continue),
    path('set_order_list/<int:order_id>',orders.set_order_list),

    path('dryclean_payment/',payments.dryclean_payment),
    path('spending_payment/',payments.spending_payment),
    
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

