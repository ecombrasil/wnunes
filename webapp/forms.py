from django import forms
from martor.fields import MartorFormField
from .models import UF_CHOICES, BlogPost
from lets_debug import DecoratorTools as decorators


def create_attrs(placeholder=None, css_class=None):
    return {
        'placeholder': placeholder,
        'class': css_class or 'login-field'
    }

class CriarContaForm(forms.Form):
    nome = forms.CharField(max_length=150, label='', help_text='', widget=forms.TextInput(attrs=create_attrs('Nome')))
    is_pessoa_juridica = forms.BooleanField(label='', help_text='')
    sobrenome = forms.CharField(max_length=150, label='', help_text='', widget=forms.TextInput(attrs=create_attrs('Sobrenome')), required=False)
    cpf = forms.CharField(max_length=14, label='', help_text='', widget=forms.TextInput(attrs=create_attrs('CPF ou CNPJ (números)')))
    uf = forms.ChoiceField(choices=UF_CHOICES, label='', help_text='', required=False, widget=forms.Select(attrs=create_attrs('UF (para pessoa jurídica)')))
    email = forms.EmailField(label='', help_text='', widget=forms.EmailInput(attrs=create_attrs('Email')))
    senha = forms.CharField(max_length=128, label='', help_text='', widget=forms.PasswordInput(attrs=create_attrs('Senha')))

class MontarKitForm(forms.Form):
    ALTURA = (
        (35, '35mm',),
        (40, '40mm',),
    )

    TELHADO = (
        ('T1', 'Cerâmico',),
        ('T2', 'Fibrocimento',),
        ('T3', 'Shingle',),
        ('T4', 'Metálico trapezoidal',),
        ('T5', 'Metálico trapezoidal mini trilho baixo',),
        ('T6', 'Metálico trapezoidal mini trilho alto',),
        ('T7', 'Metálico perfil corrido baixo',),
        ('T8', 'Metálico perfil corrido alto',),
    )

    DISTANCIA_ANCORAGEM = (
        (60, '60cm',),
        (80, '80cm',),
        (100, '100cm',),
        (120, '120cm',),
        (130, '130cm',),
        (150, '150cm',),
        (180, '180cm',),
        (200, '200cm',),
    )

    ORIENTACAO = (
        ('P', 'Paisagem',),
        ('R', 'Retrato',),
    )

    altura = forms.ChoiceField(choices=ALTURA, required=True)
    telhado = forms.ChoiceField(choices=TELHADO, required=True)
    distancia_ancoragem = forms.ChoiceField(choices=DISTANCIA_ANCORAGEM, required=False)
    orientacao = forms.ChoiceField(choices=ORIENTACAO, required=True)

class ContatoMontarKit(forms.Form):
    email = forms.EmailField(required=False)
    whatsapp = forms.CharField(max_length=20, required=False)
    telefone = forms.CharField(max_length=20, required=False)

    @decorators.override
    def is_valid(self):
        if super().is_valid():
            for key, value in self.cleaned_data.items():
                if value:
                    return True

        return False

class BlogPostForm(forms.Form):
    titulo = forms.CharField(max_length=48)
    conteudo = MartorFormField()
