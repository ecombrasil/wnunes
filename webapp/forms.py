from django import forms
from martor.fields import MartorFormField
from .models import UF_CHOICES, BlogPost

def create_attrs(placeholder=None, css_class=None):
    return {
        'placeholder': placeholder,
        'class': css_class or 'login-field'
    }

class CriarContaForm(forms.Form):
    nome = forms.CharField(max_length=150, label='', help_text='', widget=forms.TextInput(attrs=create_attrs('Nome')))
    is_pessoa_juridica = forms.BooleanField(label='Pessoa jurídica', help_text='')
    sobrenome = forms.CharField(max_length=150, label='', help_text='', widget=forms.TextInput(attrs=create_attrs('Sobrenome')), required=False)
    cpf = forms.CharField(max_length=14, label='', help_text='', widget=forms.TextInput(attrs=create_attrs('CPF ou CNPJ (números)')))
    uf = forms.ChoiceField(choices=UF_CHOICES, label='', help_text='', required=False, widget=forms.Select(attrs=create_attrs('UF (para pessoa jurídica)')))
    email = forms.EmailField(label='', help_text='', widget=forms.EmailInput(attrs=create_attrs('Email')))
    senha = forms.CharField(max_length=128, label='', help_text='', widget=forms.PasswordInput(attrs=create_attrs('Senha')))

class BlogPostForm(forms.Form):
    titulo = forms.CharField(max_length=48)
    conteudo = MartorFormField()