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
    ItemCarrinho,
    BlogPost,
    AvaliacaoCliente,
)
from .forms import CriarContaForm


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

class CatalogoProdutos(View):
    def get(self, request):
        queryset_produtos = Produto.objects.filter(ativo=True)
        # Cria lista com pontuação média para cada produto baseando-se em suas avalições
        avaliacoes_produtos = [{
            'pk': produto.pk,
            'pontuacao': produto.get_pontuacao()
        } for produto in queryset_produtos]
        # Serializa a QuerySet de produtos para renderizá-la em JSON no template
        produtos = SafeString(serialize('json', queryset_produtos))
        return render(request, 'catalogo.produtos.html', {
            'produtos': produtos,
            'avaliacoes': avaliacoes_produtos
        })

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
                valor_kit = 0
                produtos_kit = item.kit.produtos.all()
                for produto_kit in produtos_kit:
                    valor_kit += produto_kit.preco * item.qntd

                valor_total += valor_kit
                # Guarda informação do valor total do kit para exibição no carrinho
                valores_kits.append({ 'pk': item.kit.pk, 'total': valor_kit })
        
        return render(request, 'carrinho.html', {'carrinho': itens, 'total': valor_total })

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