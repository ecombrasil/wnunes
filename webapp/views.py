from django.shortcuts import render, redirect
from django.views import View
from django.views.generic import TemplateView, ListView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth import authenticate, login, logout
from django.core.serializers import serialize
from django.utils.safestring import SafeString
from .models import User, Produto, ItemCarrinho, ItemKit
from .forms import CriarContaForm


class Inicio(TemplateView):
    template_name = 'inicio.html'

class SobreNos(TemplateView):
    template_name = 'sobre.nos.html'

class Videos(TemplateView):
    template_name = 'videos.html'

class CatalogoProdutos(View):
    def get(self, request):
        queryset = Produto.objects.all()
        data = serialize('json', queryset)
        produtos = SafeString(data)
        
        return render(request, 'catalogo.produtos.html', { 'produtos': produtos })

class Carrinho(LoginRequiredMixin, View):
    login_url = '/entrar'

    def get(self, request):
        itens = ItemCarrinho.objects.filter(cliente=request.user)
        valor_total = 0
        for item in itens:
            if item.produto is not None:
                valor_total += item.produto.preco * item.qntd
            elif item.kit is not None:
                itens_kit = ItemKit.objects.filter(kit=item.kit)
                for item_kit in itens_kit:
                    valor_total += item_kit.produto.preco * item_kit.qntd
        
        return render(request, 'carrinho.html', { 'carrinho': itens, 'total': valor_total })

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
            nome = form.cleaned_data['nome']
            sobrenome = form.cleaned_data['sobrenome']
            cpf = form.cleaned_data['cpf']
            email = form.cleaned_data['email']
            senha = form.cleaned_data['senha']
            
            usuario = User.objects.create_user(email, senha)
            usuario.first_name = nome
            usuario.last_name = sobrenome
            usuario.cpf = cpf
            usuario.save()
            
            usuario = authenticate(request, username=email, password=senha)

            if usuario is not None:
                login(request, usuario)
                return redirect('inicio')
            
        return render(request, 'criar.conta.html', { 'form': form, 'error': True })

class Sair(View):
    def get(self, request):
        if request.user.is_authenticated:
            logout(request)
        return redirect('entrar')