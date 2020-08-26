from django.shortcuts import render, redirect
from django.views import View
from django.views.generic import TemplateView
from django.contrib.auth import authenticate, login, logout

from .models import User
from .forms import CriarContaForm

from lets_debug import terminal, DecoratorTools as debug


class Entrar(View):
    def get(self, request):
        return render(request, 'entrar.html', { 'error': False })

    def post(self, request):
        email = request.POST['email']
        senha = request.POST['senha']
        usuario = authenticate(request, username=email, password=senha)

        if usuario is not None:
            login(request, usuario)
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

            usuario = User.objects.create(
                first_name=nome,
                last_name=sobrenome,
                cpf=cpf,
                email=email,
                password=senha
            )
            usuario = authenticate(request, username=email, password=senha)
            login(request, usuario)
            
            return redirect('inicio')
            
        return render(request, 'criar.conta.html', { 'form': form, 'error': True })

class Sair(View):
    def get(self, request):
        if request.user.is_authenticated:
            logout(request)
        return redirect('entrar')

class Inicio(TemplateView):
    def get(self, request):
        return render(request, 'inicio.html', { 'user': request.user })