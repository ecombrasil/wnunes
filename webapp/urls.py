from django.urls import path
from .views import (
    Inicio,
    Entrar,
    CriarConta,
    Sair,
)

urlpatterns = [
    path('', Inicio.as_view(), name='inicio'),
    path('entrar', Entrar.as_view(), name='entrar'),
    path('criar-conta', CriarConta.as_view(), name='criar_conta'),
    path('sair', Sair.as_view(), name='sair')
]