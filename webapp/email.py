from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from .utils import get_uuid
from .models import User
from lets_debug import terminal

class ExpedidorEmail:
    from_email = 'example@example.com'

    @staticmethod
    def boas_vindas(usuario: User) -> None:
        conteudo = render_to_string('email/boas-vindas.html', {
            'nome': usuario.first_name
        })

        send_mail(
            subject = 'Bem-vindo(a) à Wnunes!',
            message = strip_tags(conteudo),
            html_message = conteudo,
            from_email = ExpedidorEmail.from_email,
            recipient_list = [usuario.email],
            fail_silently = False
        )

    @staticmethod
    def esqueci_minha_senha(usuario: User) -> None:
        nova_senha = get_uuid()
        usuario.set_password(nova_senha)
        usuario.save()

        conteudo = render_to_string('email/esqueci-minha-senha.html', {
            'nome': usuario.first_name,
            'senha': nova_senha
        })

        send_mail(
            subject = 'Recuperação da sua senha na Wnunes',
            message = strip_tags(conteudo),
            html_message = conteudo,
            from_email = ExpedidorEmail.from_email,
            recipient_list = [usuario.email],
            fail_silently = False
        )
