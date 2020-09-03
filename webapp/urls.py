from django.urls import path
from .views import (
    Entrar,
    CriarConta,
    Sair,
    Inicio,
    SobreNos,
    Videos,
    CatalogoProdutos,
    Carrinho,
    ArtigoBlog,
)

urlpatterns = [
    path('', Inicio.as_view(), name='inicio'),
    path('sobre-nos', SobreNos.as_view(), name='sobre_nos'),
    path('videos', Videos.as_view(), name='videos'),
    path('blog/artigo/<int:pk>', ArtigoBlog.as_view(), name='artigo_blog'),
    path('catalogo/produtos', CatalogoProdutos.as_view(), name='catalogo_produtos'),
    path('carrinho', Carrinho.as_view(), name='carrinho'),
    path('entrar', Entrar.as_view(), name='entrar'),
    path('criar-conta', CriarConta.as_view(), name='criar_conta'),
    path('sair', Sair.as_view(), name='sair')
]