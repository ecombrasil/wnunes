from django.urls import path
from .views import (
    Entrar,
    CriarConta,
    Sair,
    Inicio,
    SobreNos,
)

urlpatterns = [
    path('', Inicio.as_view(), name='inicio'),
    path('sobre-nos', SobreNos.as_view(), name='sobre_nos'),
    path('entrar', Entrar.as_view(), name='entrar'),
    path('criar-conta', CriarConta.as_view(), name='criar_conta'),
    path('sair', Sair.as_view(), name='sair')
]