from django.shortcuts import render, redirect
from django.views import View
from django.views.generic import TemplateView, ListView, DetailView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth import authenticate, login, logout
from django.core.serializers import serialize
from django.utils.safestring import SafeString
from .models import (
    User,
    Produto,
    Kit,
    ItemCarrinho,
    BlogPost,
    AvaliacaoCliente,
)
from .forms import CriarContaForm


### Compartilhado

class Inicio(TemplateView):
    template_name = 'inicio.html'

class SobreNos(TemplateView):
    template_name = 'sobre.nos.html'

class Videos(TemplateView):
    template_name = 'videos.html'

class Blog(ListView):
    template_name = 'blog.html'
    model = BlogPost
    ordering = ['-data_criacao']

class ArtigoBlog(DetailView):
    template_name = 'artigo.html'
    model = BlogPost

class _Catalogo(View):
    model = None

    def get(self, request):
        queryset = self.model.objects.filter(ativo=True)
        avaliacoes = [{
            'pk': item.pk,
            'pontuacao': item.get_pontuacao(),
        } for item in queryset]

        lista_itens = SafeString(serialize('json', queryset))
        return render(request, 'catalogo.html', {
            'produtos': lista_itens,
            'avaliacoes': avaliacoes
        })

class CatalogoProdutos(_Catalogo):
    model = Produto

class CatalogoKits(_Catalogo):
    model = Kit

### Somente com login

class Carrinho(LoginRequiredMixin, View):
    login_url = '/entrar'

    def get(self, request):
        itens = ItemCarrinho.objects.filter(cliente=request.user)
        # Valor total exibido no carrinho
        valor_total = 0
        # Valor total de cada kit
        valores_kits = []
        # Loop para somar os valores
        for item in itens:
            # Soma valor do produto
            if item.produto is not None:
                valor_total += item.produto.preco * item.qntd
            # Soma valor de cada produto no kit
            elif item.kit is not None:
                valor_kit = item.kit.get_valor_total()
                valor_total += valor_kit
                # Guarda informação do valor total do kit para exibição no carrinho
                valores_kits.append({ 'pk': item.kit.pk, 'total': valor_kit })
        
        return render(request, 'carrinho.html', { 'carrinho': itens, 'total': valor_total })

### Sessão

class Entrar(View):
    def get(self, request):
        proxima_pagina = request.GET.get('next')
        return render(request, 'entrar.html', { 'error': False, 'next': proxima_pagina })

    def post(self, request):
        email = request.POST['email']
        senha = request.POST['senha']
        proxima_pagina = request.POST['next']
        usuario = authenticate(request, username=email, password=senha)

        if usuario is not None:
            login(request, usuario)
            if proxima_pagina != 'None':
                return redirect(proxima_pagina)
            return redirect('inicio')
        else:
            return render(request, 'entrar.html', { 'error': True })

class CriarConta(View):
    def get(self, request):
        return render(request, 'criar.conta.html', { 'form': CriarContaForm(auto_id=False), 'error': False })

    def post(self, request):
        form = CriarContaForm(request.POST, auto_id=False)
        
        if form.is_valid():
            # Pega os campos do formulário
            nome = form.cleaned_data['nome']
            sobrenome = form.cleaned_data['sobrenome']
            cpf = form.cleaned_data['cpf']
            email = form.cleaned_data['email']
            senha = form.cleaned_data['senha']
            # Cria o novo usuário
            usuario = User.objects.create_user(email, senha)
            usuario.first_name = nome
            usuario.last_name = sobrenome
            usuario.cpf = cpf
            usuario.save()
            # Autentica o usuário
            usuario = authenticate(request, username=email, password=senha)
            # Faz login do usuário
            if usuario is not None:
                login(request, usuario)
                return redirect('inicio')
            
        return render(request, 'criar.conta.html', { 'form': form, 'error': True })

class Sair(View):
    def get(self, request):
        if request.user.is_authenticated:
            logout(request)
        return redirect('entrar')

### Testes

class Teste:
    @staticmethod
    def bad_request(request):
        from django.core.exceptions import SuspiciousOperation
        raise SuspiciousOperation

    @staticmethod
    def forbidden(request):
        from django.core.exceptions import PermissionDenied
        raise PermissionDenied

    @staticmethod
    def server_error(request):
        1 / 'a'

### Manipular erros

class ErrorHandlers:
    @staticmethod
    def handler400(request, exception=None):
        return render(request, '400.html', status=400)

    @staticmethod
    def handler403(request, exception=None):
        return render(request, '403.html', status=403)

    @staticmethod
    def handler404(request, exception=None):
        return render(request, '404.html', status=404)

    @staticmethod
    def handler500(request):
        return render(request, '500.html', status=500)