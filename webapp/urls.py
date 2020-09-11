from django.urls import path
from .views import (
    Entrar,
    CriarConta,
    Sair,
    Inicio,
    SobreNos,
    Videos,
    ProdutoView,
    CatalogoProdutos,
    CatalogoKits,
    Carrinho,
    Blog,
    ArtigoBlog,
    ErrorTrigger,
)

urlpatterns = [
    path('', Inicio.as_view(), name='inicio'),
    path('sobre-nos', SobreNos.as_view(), name='sobre_nos'),
    path('videos', Videos.as_view(), name='videos'),
    path('blog', Blog.as_view(), name='blog'),
    path('blog/artigo/<int:pk>/<str:titulo>', ArtigoBlog.as_view(), name='artigo_blog'),
    path('catalogo/produtos', CatalogoProdutos.as_view(), name='catalogo_produtos'),
    path('catalogo/kits', CatalogoKits.as_view(), name='catalogo_kits'),
    path('produto/<int:pk>', ProdutoView.as_view(), name='produto'),
    path('carrinho', Carrinho.as_view(), name='carrinho'),
    path('entrar', Entrar.as_view(), name='entrar'),
    path('criar-conta', CriarConta.as_view(), name='criar_conta'),
    path('sair', Sair.as_view(), name='sair'),
    path('teste/server-error', ErrorTrigger.server_error, name='server_error'),
    path('teste/forbidden', ErrorTrigger.forbidden, name='forbidden'),
    path('teste/bad-request', ErrorTrigger.bad_request, name='bad_request'),
]