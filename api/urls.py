from django.urls import path
from . import orders
from . import loaders
from . import logins
from . import payments
from . import prices
from . import reports

urlpatterns = [
    path('login_user/',logins.login_user),
    path('signup/',logins.create_user),
    path('logout_user/',logins.logout_user),
    path('load_user/',logins.load_user),
    path('load_user_extra_password/',logins.load_user_extra_password),
    path('create_client/',logins.create_client),
    path('get_link_invite_admin/',logins.get_link_invite_admin),
    path('get_link_recover_password_admin/',logins.get_link_recover_password_admin),
    path('add_password_admin_invite/',logins.add_password_admin_invite),
    path('set_recover_password/',logins.set_recover_password),
    path('edit_my_user/',logins.edit_my_user),
    path('change_my_password/',logins.change_my_password),
    path('edit_user/',logins.edit_user),

    path('change_prices/',prices.change_prices),

    path('create_order/',orders.create_order),
    path('promote_order/',orders.promote_order),
    path('delete_order/',orders.delete_order),
    path('save_payment_and_continue/',orders.save_payment_and_continue),
    path('set_order_list/<int:order_id>/',orders.set_order_list),
    path('set_order_list_get_message/<int:order_id>/',orders.set_order_list),
    path('clothes_ready_message/<int:order_id>/',orders.clothes_ready_message),

    path('dryclean_payment/',payments.dryclean_payment),
    path('spending_payment/',payments.spending_payment),
    path('edit_spending/',payments.edit_spending),
    path('edit_drycleaning/',payments.edit_drycleaning),
    path('set_cutout/',payments.set_cutout),

    path('reports_info/',reports.month_year_info),
    path('reports_info/<int:month>/<int:year>/',reports.month_year_info),
    path('income_report_info/',reports.income_report_info),
    
    path('home_info/',loaders.home_info),
    path('home_info/<int:page>/',loaders.home_info),
    path('signup_info/',loaders.signup_info),
    path('signup_info/<str:JWTCode>/',loaders.signup_info),
    path('config_info/',loaders.config_info),
    path('faq_info/',loaders.faq_info),
    path('price_info/',loaders.price_info),
    path('create_order_info/',loaders.create_order_info),
    path('order_info/<int:order_id>/',loaders.order_info),
    path('drycleaning_info/',loaders.drycleaning_info),
    path('drycleaning_info/<int:page>/',loaders.drycleaning_info),
    path('spending_info/',loaders.spending_info),
    path('spending_info/<int:page>/',loaders.spending_info),
    path('laundry_machines_info/',loaders.laundry_machines_info),
    path('laundry_machines_info/<int:day>/<int:month>/<int:year>/',loaders.laundry_machines_info),
    path('clients_info/',loaders.clients_info),
    path('edit_user_info/<int:user_id>/',loaders.edit_user_info),
    path('signup_admin_invite_info/<str:JWTInvite>/',loaders.signup_admin_invite_info),
    path('recover_pw_info/<str:JWTInvite>/',loaders.recover_pw_info),
    path('closeout_info/',loaders.closeout_info),
    path('closeout_info/<int:day>/<int:month>/<int:year>/',loaders.closeout_info),
]

