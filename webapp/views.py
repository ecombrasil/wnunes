from django.shortcuts import render, redirect
from django.views import View
from django.views.generic import TemplateView, ListView, DetailView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth import authenticate, login, logout
from .models import (
    User,
    Produto,
    Kit,
    ItemCarrinho,
    BlogPost,
    AvaliacaoCliente,
)
from .forms import CriarContaForm
import json


### Compartilhado

class Inicio(TemplateView):
    template_name = 'inicio.html'

class SobreNos(TemplateView):
    template_name = 'sobre.nos.html'

class Videos(TemplateView):
    template_name = 'videos.html'

class Blog(ListView):
    template_name = 'blog.html'
    context_object_name = 'posts'
    model = BlogPost
    ordering = ['-data_criacao']

class ArtigoBlog(DetailView):
    template_name = 'artigo.html'
    model = BlogPost

class ProdutoView(DetailView):
    template_name = 'produto.html'
    model = Produto

class KitView(DetailView):
    template_name = 'kit.html'
    model = Kit

class _Catalogo(View):
    model = None

    def get(self, request):
        queryset = self.model.objects.filter(ativo=True)
        avaliacoes = [{
            'pk': item.pk,
            'pontuacao': item.get_pontuacao(),
        } for item in queryset]
        
        avaliacoes = json.dumps(avaliacoes)
        
        return render(request, 'catalogo.html', {
            'produtos': queryset,
            'avaliacoes': avaliacoes
        })

class CatalogoProdutos(_Catalogo):
    model = Produto

class CatalogoKits(_Catalogo):
    model = Kit

### Somente com login

class LoggedUserView(LoginRequiredMixin, View):
    login_url = '/entrar'

class Carrinho(LoggedUserView):
    def get(self, request):
        itens = ItemCarrinho.objects.filter(cliente=request.user).exclude(produto__ativo=False).exclude(kit__ativo=False)

        # Valor total exibido no carrinho
        valor_total = 0
        # Loop para somar os valores
        for item in itens:
            # Soma valor do produto
            if item.produto is not None:
                valor_total += item.produto.preco * item.qntd
            # Soma valor de cada produto no kit
            elif item.kit is not None:
                valor_total += item.kit.get_valor_total() * item.qntd
        
        return render(request, 'carrinho.html', { 'carrinho': itens, 'total': valor_total })


class AdicionarCarrinho(LoggedUserView):
    def get(self, request, tipo=None, pk=None):
        # Se for produto e ele não existir no carrinho ainda, é adicionado
        if tipo == 'produto':
            produto = Produto.objects.get(pk=pk)
            if produto is not None:
                existe_no_carrinho = ItemCarrinho.objects.filter(cliente=request.user, produto=produto).exists()
                if not existe_no_carrinho:
                    ItemCarrinho.objects.create(cliente=request.user, produto=produto)

        # Se for kit e ele não existir no carrinho ainda, é adicionado
        elif tipo == 'kit':
            kit = Kit.objects.get(pk=pk)
            if kit is not None:
                existe_no_carrinho = ItemCarrinho.objects.filter(cliente=request.user, kit=kit).exists()
                if not existe_no_carrinho:
                    ItemCarrinho.objects.create(cliente=request.user, kit=kit)

        # Retorna a view de renderização com toda a lógica para a amostra dos ítens
        return redirect('carrinho')

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
            if proxima_pagina != 'None' and proxima_pagina != '':
                return redirect(proxima_pagina)
            return redirect('inicio')
        else:
            return render(request, 'entrar.html', { 'error': True, 'next': proxima_pagina })

class CriarConta(View):
    def get(self, request):
        return render(request, 'criar.conta.html', { 'form': CriarContaForm(auto_id=False), 'error': False })

    def post(self, request):
        form = CriarContaForm(request.POST, auto_id=False)
        
        if form.is_valid():
            # Pega os campos do formulário
            nome = form.cleaned_data['nome_completo']
            cpf = form.cleaned_data['cpf']
            email = form.cleaned_data['email']
            senha = form.cleaned_data['senha']
            # Cria o novo usuário
            usuario = User.objects.create_user(email, senha)
            usuario.first_name = nome
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

class ErrorTrigger:
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
        raise TypeError

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