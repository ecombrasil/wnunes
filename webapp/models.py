from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import ugettext_lazy as _
from martor.models import MartorField
import datetime

class UserManager(BaseUserManager):
    """Define a model manager for User model with no username field."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)

UF_CHOICES = (
    ('AC', 'Acre'), 
    ('AL', 'Alagoas'),
    ('AP', 'Amapá'),
    ('BA', 'Bahia'),
    ('CE', 'Ceará'),
    ('DF', 'Distrito Federal'),
    ('ES', 'Espírito Santo'),
    ('GO', 'Goiás'),
    ('MA', 'Maranão'),
    ('MG', 'Minas Gerais'),
    ('MS', 'Mato Grosso do Sul'),
    ('MT', 'Mato Grosso'),
    ('PA', 'Pará'),
    ('PB', 'Paraíba'),
    ('PE', 'Pernanbuco'),
    ('PI', 'Piauí'),
    ('PR', 'Paraná'),
    ('RJ', 'Rio de Janeiro'),
    ('RN', 'Rio Grande do Norte'),
    ('RO', 'Rondônia'),
    ('RR', 'Roraima'),
    ('RS', 'Rio Grande do Sul'),
    ('SC', 'Santa Catarina'),
    ('SE', 'Sergipe'),
    ('SP', 'São Paulo'),
    ('TO', 'Tocantins'),
)

class User(AbstractUser):
    """User model."""

    is_pessoa_juridica = models.BooleanField(default=False)
    cpf = models.CharField(max_length=14, null=False, blank=False)
    uf = models.CharField(max_length=2, choices=UF_CHOICES, blank=True, null=True)
    
    username = None
    email = models.EmailField(_('email address'), unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

class Produto(models.Model):
    nome = models.CharField(max_length=128)
    preco = models.FloatField(verbose_name='Preço')
    qntd_estoque = models.PositiveIntegerField(default=0, verbose_name='Quantidade em estoque')
    descricao = models.CharField(max_length=200, verbose_name='Descrição')
    medidas = models.CharField(max_length=32, blank=True, null=True)
    imagem_url = models.CharField(max_length=200, verbose_name='Link da imagem', blank=True, null=True)
    data_criacao = models.DateField(auto_now_add=True, verbose_name='Data de criação no banco de dados')

    def __str__(self):
        return self.nome

class AvaliacaoCliente(models.Model):
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    cliente = models.ForeignKey(User, on_delete=models.CASCADE)
    titulo = models.CharField(max_length=48, verbose_name='Título')
    texto = models.CharField(max_length=200)
    pontuacao = models.PositiveIntegerField(default=5, validators=[MinValueValidator(1), MaxValueValidator(5)], verbose_name='Pontuação (0-5)')
    data_criacao = models.DateField(auto_now_add=True, verbose_name='Data de criação no banco de dados')

    def __str__(self):
        return f"{self.produto}, por {self.cliente}"

    class Meta:
        verbose_name_plural = 'Avaliações dos produtos'

class Kit(models.Model):
    nome = models.CharField(max_length=48)
    descricao = models.CharField(max_length=200, blank=True, null=True, verbose_name='Descrição')
    data_criacao = models.DateField(auto_now_add=True, verbose_name='Data de criação no banco de dados')

    def __str__(self):
        return self.nome
    
class ItemKit(models.Model):
    kit = models.ForeignKey(Kit, on_delete=models.CASCADE)
    produto = models.ForeignKey(Produto, on_delete=models.PROTECT)
    qntd = models.PositiveIntegerField(default=1, verbose_name='Quantidade')

    def __str__(self):
        return f"{self.produto} | {self.kit}"

    class Meta:
        verbose_name_plural = 'Itens em kits'

class MensagemSite(models.Model):
    nome = models.CharField(max_length=128)
    email = models.EmailField()
    mensagem = models.CharField(max_length=200)
    data_criacao = models.DateField(auto_now_add=True, verbose_name='Data de criação no banco de dados')

    def __str__(self):
        return f"{self.nome}, em {self.data_criacao}"

    class Meta:
        verbose_name_plural = 'Mensagens do site'

class ItemCarrinho(models.Model):
    cliente = models.ForeignKey(User, on_delete=models.CASCADE)
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE, null=True)
    kit = models.ForeignKey(Kit, on_delete=models.CASCADE, null=True)
    qntd = models.PositiveIntegerField(default=1, verbose_name='Quantidade')

    def __str__(self):
        return f"{self.produto or self.kit} | {self.cliente}"

    class Meta:
        verbose_name_plural = 'Ítens em carrinhos'

class BlogPost(models.Model):
    titulo = models.CharField(max_length=48)
    conteudo = MartorField()
    data_criacao = models.DateField(auto_now_add=True, verbose_name='Data de criação no banco de dados')

    def __str__(self):
        return self.titulo

    class Meta:
        verbose_name = 'Artigo do blog'
        verbose_name_plural = 'Artigos do blog'