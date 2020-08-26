from django import forms

def create_attrs(placeholder=None, css_class=None):
    return {
        'placeholder': placeholder,
        'class': css_class or 'login-field'
    }

class CriarContaForm(forms.Form):
    email = forms.EmailField(label='', help_text='', widget=forms.EmailInput(attrs=create_attrs('Email')))
    nome = forms.CharField(max_length=150, label='', help_text='', widget=forms.TextInput(attrs=create_attrs('Nome')))
    sobrenome = forms.CharField(max_length=150, label='', help_text='', widget=forms.TextInput(attrs=create_attrs('Sobrenome')))
    cpf = forms.CharField(max_length=14, label='', help_text='', widget=forms.TextInput(attrs=create_attrs('CPF')))
    senha = forms.CharField(max_length=128, label='', help_text='', widget=forms.PasswordInput(attrs=create_attrs('Senha')))