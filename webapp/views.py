from django.shortcuts import render, redirect
from django.views import View
from django.views.generic import TemplateView, ListView, DetailView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth import authenticate, login, logout
from django.db.models.signals import post_save
from django.dispatch import receiver
from .email import ExpedidorEmail
from .utils import UUIDEncoder
from .forms import CriarContaForm
from .models import (
    User,
    Produto,
    Kit,
    ItemCarrinho,
    BlogPost,
    AvaliacaoCliente,
)
import json


### Receivers

@receiver(post_save, sender=User)
def enviar_email_boas_vindas(sender, instance=None, created=False, **kwargs):
    if created:
        ExpedidorEmail.boas_vindas(instance)

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
        
        avaliacoes = json.dumps(avaliacoes, cls=UUIDEncoder)
        
        return render(request, 'catalogo.html', {
            'produtos': queryset,
            'avaliacoes': avaliacoes
        })

class CatalogoProdutos(_Catalogo):
    model = Produto

class CatalogoKits(_Catalogo):
    model = Kit

class EsqueciMinhaSenha(View):
    template_name = 'esqueci-minha-senha.html'

    def get(self, request):
        return render(request, self.template_name, { 'error': False })

    def post(self, request):
        email = request.POST.get('email')
        usuario = User.objects.filter(email=email).first()

        if usuario is not None:
            ExpedidorEmail.esqueci_minha_senha(usuario)
            return redirect('/entrar')
        else:
            return render(request, self.template_name, { 'error': True })

### Somente com login

class LoggedUserView(LoginRequiredMixin, View):
    login_url = '/entrar'

class Carrinho(LoggedUserView):
    def get(self, request):
        itens = self.__get_carrinho(request)

        # Valor total exibido no carrinho
        valor_total = 0

        # Remove os itens indisponíveis e soma o valor dos itens disponíveis
        for item in itens:
            unidade = item.produto or item.kit
            qntd_disponivel = unidade.get_qntd_disponivel()

            if qntd_disponivel == 0:
                item.delete()
                continue
            elif item.qntd > qntd_disponivel:
                item.qntd = qntd_disponivel
                item.save()
            
            if isinstance(unidade, Produto):
                valor_total += unidade.preco * item.qntd
            else:
                valor_total += unidade.get_valor_total() * item.qntd
        
        return render(request, 'carrinho.html', {
            'carrinho': self.__get_carrinho(request),
            'total': round(valor_total, 2)
        })

    def __get_carrinho(self, request):
        return request.user.get_carrinho()


class AdicionarCarrinho(LoggedUserView):
    def get(self, request, tipo=None, pk=None):
        # Se for produto e ele não existir no carrinho ainda, é adicionado
        if tipo == 'produto':
            produto = Produto.objects.get(pk=pk)
            if produto is not None and produto.is_disponivel():
                existe_no_carrinho = ItemCarrinho.objects.filter(cliente=request.user, produto=produto).exists()
                if not existe_no_carrinho:
                    ItemCarrinho.objects.create(cliente=request.user, produto=produto)

        # Se for kit e ele não existir no carrinho ainda, é adicionado
        elif tipo == 'kit':
            kit = Kit.objects.get(pk=pk)
            if kit is not None and kit.is_disponivel():
                existe_no_carrinho = ItemCarrinho.objects.filter(cliente=request.user, kit=kit).exists()
                if not existe_no_carrinho:
                    ItemCarrinho.objects.create(cliente=request.user, kit=kit)

        # Retorna a view de renderização com toda a lógica para a amostra dos ítens
        return redirect('carrinho')

### Sessão

class Entrar(View):
    def get(self, request):
        return render(request, 'entrar.html', {
            'email': '',
            'error': False,
            'next': request.GET.get('next')
        })

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
            return render(request, 'entrar.html', {
                'email': email,
                'error': True,
                'next': proxima_pagina
            })

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
            usuario = User.objects.create_user(email, senha, first_name=nome, cpf=cpf)
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