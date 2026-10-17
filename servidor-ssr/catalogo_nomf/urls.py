
from django.urls import path
from . import views

urlpatterns = [
    path('catalogo_nomf/', views.vista_ssr, name='catalogo_ssr'),
]