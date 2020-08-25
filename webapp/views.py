from django.shortcuts import render, redirect
from django.views import View
from django.contrib.auth import authenticate, login, logout
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

class Sair(View):
    def get(self, request):
        if request.user.is_authenticated:
            logout(request)
        return redirect('entrar')

class Inicio(View):
    def get(self, request):
        return render(request, 'inicio.html')