from django.urls import path
from . import views


urls = [
    '',
    # 'servicios/',
    # 'nosotros/',
    'lista-de-precios/',
    'preguntas-frecuentes/'
]

urls_anonymous_only = [
    'iniciar-sesion/',
    'crear-cuenta/',
    'crear-cuenta/<str:JWTCode>/',
    'invitacion-admin/<str:JWTinvite>/',
    'recuperar-contrasena/<str:JWTinvite>/',
]

urls_admin_only = [
    "crear-orden/",
    "crear-cliente/",
    "crear-orden/<int:user_id>/",
    "tintoreria/",
    "gastos/",
    "reportes/",
    "lavadoras/",
    "lavadoras/<int:day>/<int:month>/<int:year>/",
    "clientes/",
    "editar-cliente/<int:user_id>/",
    "reportes/<int:month>/<int:year>/",
]

urls_all_users_only = [
    # 'cliente-frecuente/',
    'configuracion/',
    'configuracion/cambiar-contrasena/',
    'configuracion/mis-datos/',
]

urls_users_only = [
    # 'mis-ordenes/',
    # 'invitar/'
]


urlpatterns = [*list(map(lambda x:path(x,views.main),urls)),
    *list(map(lambda x:path(x,views.all_users_only),urls_all_users_only)),
    *list(map(lambda x:path(x,views.admin_only),urls_admin_only)),
    *list(map(lambda x:path(x,views.anonymous_only),urls_anonymous_only)),
    *list(map(lambda x:path(x,views.users_only),urls_users_only)),
    path("orden/<int:order_id>/", views.order),
]

