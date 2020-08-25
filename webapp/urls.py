from django.urls import path
from django.views.generic import TemplateView
from .views import (
    Inicio,
    Entrar,
    Sair,
)

urlpatterns = [
    path('', Inicio.as_view(), name='inicio'),
    path('entrar', Entrar.as_view(), name='entrar'),
    path('sair', Sair.as_view(), name='sair')
]