from django.urls import path
from .views import (
    Entrar,
    CriarConta,
    Sair,
    Inicio,
    SobreNos,
    Videos,
    Produto,
    CatalogoProdutos,
    CatalogoKits,
    Carrinho,
    Blog,
    ArtigoBlog,
    Teste,
)

urlpatterns = [
    path('', Inicio.as_view(), name='inicio'),
    path('sobre-nos', SobreNos.as_view(), name='sobre_nos'),
    path('videos', Videos.as_view(), name='videos'),
    path('blog', Blog.as_view(), name='blog'),
    path('blog/artigo/<int:pk>', ArtigoBlog.as_view(), name='artigo_blog'),
    path('catalogo/produtos', CatalogoProdutos.as_view(), name='catalogo_produtos'),
    path('catalogo/kits', CatalogoKits.as_view(), name='catalogo_kits'),
    path('produto/<int:pk>', Produto.as_view(), name='produto'),
    path('carrinho', Carrinho.as_view(), name='carrinho'),
    path('entrar', Entrar.as_view(), name='entrar'),
    path('criar-conta', CriarConta.as_view(), name='criar_conta'),
    path('sair', Sair.as_view(), name='sair'),
    path('teste/server-error', Teste.server_error, name='server_error'),
    path('teste/forbidden', Teste.forbidden, name='forbidden'),
    path('teste/bad-request', Teste.bad_request, name='bad_request'),
]