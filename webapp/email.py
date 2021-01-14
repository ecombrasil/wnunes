import email, smtplib, ssl
from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from decouple import config
from .utils import random_string
from .models import User

class Email:
    __remetente = 'no-reply@wnunes.com.br'
    __password = config('EMAIL_PASSWORD')

    def __init__(self, destinatario: str, assunto: str, mensagem: str):
        self.destinatario = destinatario
        self.assunto = assunto
        # Conteúdo HTML
        self.corpo = """
        <html>
            <body>
                {mensagem}
            </body>
        </html>
        """

    def __enviar(self) -> None:
        mensagem = MIMEMultipart()
        mensagem['From'] = self.__remetente
        mensagem['To'] = self.destinatario
        mensagem['Subject'] = self.assunto
        # Add body to email
        mensagem.attach(MIMEText(self.corpo, 'html')) # plain for text, html for html
        # Log in to server using secure context and send email
        self.__usar_tls(mensagem)

    def __usar_ssl(self, mensagem) -> None:
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as server:
            server.login(self.__remetente, self.__password)
            server.sendmail(self.__remetente, self.destinatario, mensagem.as_string())

    def __usar_tls(self, mensagem) -> None:
        mailserver = smtplib.SMTP('smtp-mail.outlook.com', 587)
        mailserver.ehlo()
        mailserver.starttls()
        mailserver.ehlo()
        mailserver.login(self.__remetente, self.__password)
        mailserver.sendmail(self.__remetente, self.destinatario, mensagem.as_string())
        mailserver.quit()

    def __del__(self):
        self.__enviar()

class ExpedidorEmail:

    @staticmethod
    def boas_vindas(usuario: User):
        email = usuario.email
        assunto = f"Bem-vindo à família Wnunes, {usuario.get_full_name()}"
        conteudo = """
        """

        Email(email, assunto, conteudo)

    @staticmethod
    def esqueci_minha_senha(usuario: User) -> None:
        nova_senha = random_string(11)
        usuario.set_password(nova_senha)
        usuario.save()

        email = usuario.email
        assunto = 'Recuperação da sua senha na Wnunes'
        conteudo = """
        """

        Email(email, assunto, conteudo)
