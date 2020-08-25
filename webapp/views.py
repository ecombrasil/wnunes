from django.shortcuts import render, redirect
from django.views import View
from django.views.generic import TemplateView
from django.contrib.auth import authenticate, login, logout
from .models import User
from lets_debug import DecoratorTools as debug


class Entrar(View):
    def get(self, request):
        return render(request, 'entrar.html', { 'error': False })

    def post(self, request):
        email = request.POST['email']
        senha = request.POST['senha']
        usuario = authenticate(request, email=email, password=senha)

        if usuario is not None:
            login(request, usuario)
            return redirect('inicio')
        else:
            return render(request, 'entrar.html', { 'error': True })

class CriarConta(View):
    def get(self, request):
        return render(request, 'criar.conta.html', { 'error': False })

    def post(self, request):
        email = request.POST['email']
        cpf = request.POST['cpf']
        senha = request.POST['senha']

        if email is not None and cpf is not None and senha is not None:
            usuario = User.objects.create(email=email, cpf=cpf, password=senha)
            login(request, usuario)
            return redirect('inicio')
        return render(request, 'criar.conta.html', { 'error': True })

class Sair(View):
    def get(self, request):
        if request.user.is_authenticated:
            logout(request)
        return redirect('entrar')

class Inicio(TemplateView):
    template_name = 'inicio.html'