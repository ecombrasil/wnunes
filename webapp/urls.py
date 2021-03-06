from django.urls import path, include
from .views import (
    Entrar,
    CriarConta,
    EsqueciMinhaSenha,
    Sair,
    Inicio,
    SobreNos,
    Videos,
    ProdutoView,
    KitView,
    CatalogoProdutos,
    CatalogoKits,
    Carrinho,
    AdicionarCarrinho,
    Blog,
    ArtigoBlog,
    ErrorTrigger,
)
from .api import router

urlpatterns = [
    path('', Inicio.as_view(), name='inicio'),
    path('api/', include(router.urls)),
    path('sobre-nos', SobreNos.as_view(), name='sobre_nos'),
    path('videos', Videos.as_view(), name='videos'),
    path('blog', Blog.as_view(), name='blog'),
    path('blog/artigo/<int:pk>/<str:titulo>', ArtigoBlog.as_view(), name='artigo_blog'),
    path('catalogo/produtos', CatalogoProdutos.as_view(), name='catalogo_produtos'),
    path('catalogo/kits', CatalogoKits.as_view(), name='catalogo_kits'),
    path('produto/<str:pk>', ProdutoView.as_view(), name='produto'),
    path('kit/<str:pk>', KitView.as_view(), name='kit'),
    path('carrinho', Carrinho.as_view(), name='carrinho'),
    path('carrinho/adicionar/<str:tipo>/<str:pk>', AdicionarCarrinho.as_view(), name='adicionar_carrinho'),
    path('entrar', Entrar.as_view(), name='entrar'),
    path('criar-conta', CriarConta.as_view(), name='criar_conta'),
    path('esqueci-minha-senha', EsqueciMinhaSenha.as_view(), name='esqueci_minha_senha'),
    path('sair', Sair.as_view(), name='sair'),
    path('teste/server-error', ErrorTrigger.server_error, name='server_error'),
    path('teste/forbidden', ErrorTrigger.forbidden, name='forbidden'),
    path('teste/bad-request', ErrorTrigger.bad_request, name='bad_request'),
]
