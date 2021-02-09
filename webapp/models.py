from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator, MinLengthValidator, MaxLengthValidator
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import ugettext_lazy as _
from martor.models import MartorField
from .utils import remove_acentos
import datetime, statistics, uuid



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

    def get_carrinho(self):
        """Retorna os itens do carrinho do usuário."""
        return ItemCarrinho.objects.filter(cliente=self).exclude(produto__ativo=False).exclude(kit__ativo=False)

    def __str__(self):
        return self.get_full_name()

class AvaliacaoCliente(models.Model):
    cliente = models.ForeignKey(User, on_delete=models.CASCADE)
    titulo = models.CharField(max_length=48, verbose_name='Título')
    texto = models.CharField(max_length=200)
    pontuacao = models.PositiveIntegerField(default=5, validators=[MinValueValidator(1), MaxValueValidator(5)], verbose_name='Pontuação (0-5)')
    data_criacao = models.DateField(auto_now_add=True, verbose_name='Data de criação no banco de dados')

    def __str__(self):
        return self.titulo

    class Meta:
        verbose_name_plural = 'Avaliações dos produtos'

class BaseProduto:
    avaliacoes = None

    def get_pontuacao(self):
        lista_avaliacoes = self.avaliacoes.all().values('pontuacao')
        pontuacoes = [avaliacao['pontuacao'] for avaliacao in lista_avaliacoes]

        return round(statistics.median(pontuacoes)) if len(pontuacoes) else None

class Produto(models.Model, BaseProduto):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=128)
    preco = models.FloatField(verbose_name='Preço')
    qntd_estoque = models.PositiveIntegerField(default=0, verbose_name='Quantidade em estoque')
    descricao = models.CharField(max_length=200, verbose_name='Descrição')
    medidas = models.CharField(max_length=32, blank=True, null=True)
    foto = models.FileField(upload_to='imagens_produtos', null=True)
    avaliacoes = models.ManyToManyField(AvaliacaoCliente)
    ativo = models.BooleanField(default=True, verbose_name='Mostrar no site')
    data_criacao = models.DateField(auto_now_add=True, verbose_name='Data de criação no banco de dados')

    def is_disponivel(self, qntd_minima=1):
        """Retorna um booleano indicando se o produto está ativo e e disponível em estoque."""
        return self.get_qntd_disponivel() >= qntd_minima

    def get_qntd_disponivel(self):
        """Retorna uma integer representando a quantidade disponível em estoque."""
        return 0 if not self.ativo else self.qntd_estoque

    def __str__(self):
        return self.nome

class ProdutoKit(models.Model):
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    qntd = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.produto} x {self.qntd}"

    class Meta:
        verbose_name = 'Produto em kit'
        verbose_name_plural = 'Produtos em kits'

class Kit(models.Model, BaseProduto):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=48)
    descricao = models.CharField(max_length=200, blank=True, null=True, verbose_name='Descrição')
    itens = models.ManyToManyField(ProdutoKit)
    foto = models.FileField(upload_to='imagens_kits', null=True)
    avaliacoes = models.ManyToManyField(AvaliacaoCliente)
    ativo = models.BooleanField(default=True, verbose_name='Mostrar no site')
    data_criacao = models.DateField(auto_now_add=True, verbose_name='Data de criação no banco de dados')

    def get_valor_total(self):
        """Retorna o valor do kit."""
        valor_total = 0
        lista_itens = self.itens.all()

        for item in lista_itens:
            valor_total += item.produto.preco * item.qntd

        return valor_total

    def is_disponivel(self, qntd_minima=1):
        """Retorna um booleano indicando a disponibilidade e as quantidades dos produtos presentes no kit."""
        return self.get_qntd_disponivel() >= qntd_minima

    def get_qntd_disponivel(self):
        """Retorna uma integer representando a quantidade disponível de unidades do kit."""
        if not self.ativo:
            return 0

        quantidades = []

        for item in self.itens.all():
            qntd_estoque = item.produto.qntd_estoque
            if item.produto.ativo and qntd_estoque > 0:
                # Utiliza o int() para arredondar para o menor valor inteiro
                qntd_disponivel = int(qntd_estoque / item.qntd)
                quantidades.append(qntd_disponivel)
            else:
                quantidades.append(0)

        return min(quantidades)

    def __str__(self):
        return self.nome

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
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE, blank=True, null=True)
    kit = models.ForeignKey(Kit, on_delete=models.CASCADE, blank=True, null=True)
    qntd = models.PositiveIntegerField(default=1, verbose_name='Quantidade')

    def __str__(self):
        return f"{self.produto or self.kit} | {self.cliente}"

    class Meta:
        verbose_name_plural = 'Ítens em carrinhos'

class BlogPost(models.Model):
    imagem_capa = models.FileField(upload_to='capas_artigos', null=True, verbose_name='Imagem de capa')
    titulo = models.CharField(max_length=96, verbose_name='Título')
    descricao = models.CharField(max_length=200, default='', verbose_name='Descrição do artigo (200 caracteres)')
    conteudo = MartorField()
    data_criacao = models.DateField(auto_now_add=True, verbose_name='Data de criação no banco de dados')

    def titulo_como_url(self):
        texto = f"{self.titulo}"
        texto = remove_acentos(texto.lower())
        return texto.replace(' ', '-')

    def __str__(self):
        return self.titulo

    class Meta:
        verbose_name = 'Artigo do blog'
        verbose_name_plural = 'Artigos do blog'

class CredencialPJBank(models.Model):
    """
    Modelo com as informações de credencial de conta no PJBank.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Razão social da empresa. Será usado no campo “beneficiário” do boleto. Length (3-80).
    nome_empresa = models.CharField(validators=[MinLengthValidator(3)], max_length=80, blank=False, null=False)
    # Número da conta bancaria para a qual será feito o repasse, com dígito. Formato: 99999-9, 9999-99, length (3-32).
    conta = models.CharField(validators=[MinLengthValidator(3)], max_length=32, blank=False, null=False)
    # Número da agência para a qual será feito o repasse, com ou sem dígito dependendo do banco. Formato: 99999, 9999-9, length (2-6).
    agencia = models.CharField(validators=[MinLengthValidator(2)], max_length=6, blank=False, null=False)
    # Número do banco para o qual será feito o repasse, com 3 dígitos.
    banco = models.CharField(validators=[MinLengthValidator(3)], max_length=3, blank=False, null=False)
    # CNPJ da empresa, somente números. O CNPJ deve ser o mesmo da razão social e da conta de repasse. Será exposto no boleto bancário. Length (11-14).
    cnpj = models.CharField(validators=[MinLengthValidator(11)], max_length=14, blank=False, null=False)
    # DDD do telefone da empresa, somente números, length (2-2).
    ddd = models.PositiveIntegerField(validators=[MinValueValidator(11), MaxValueValidator(99)], null=False)
    # Telefone da empresa, sem DDD. Somente números. Para uso interno, length (8-10).
    telefone = models.PositiveIntegerField(validators=[MinLengthValidator(8), MaxLengthValidator(10)], null=False)
    # E-mail da empresa. Para uso interno, length (3-255).
    email = models.EmailField(validators=[MinLengthValidator(3), MaxLengthValidator(255)], null=False)
    # Flag para credenciamento de cartão.
    cartao = models.BooleanField(default=True, null=False, verbose_name='Credenciamento de cartão')
    
    # Campos obtidos através da requisição ao PJBank
    credencial = models.CharField(max_length=255)
    chave = models.CharField(max_length=255)
    conta_virtual = models.CharField(validators=[MinLengthValidator(3)], max_length=32)
    agencia_virtual = models.CharField(validators=[MinLengthValidator(2)], max_length=6, blank=False, null=False)

    @staticmethod
    def get_last() -> CredencialPJBank:
        """
        Retorna o último registro do banco de dados.
        """
        return CredencialPJBank.objects.last()

    def __str__(self):
        return f"{self.nome_empresa} | {self.cnpj}"

    class Meta:
        verbose_name = 'Credencial de conta no PJBank'
        verbose_name_plural = 'Credenciais de contas no PJBank'

class TokenCartaoPJBank(models.Model):
    """
    Modelo para o token de cartão do PJBank.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # ID do token
    tid = models.CharField(max_length=255)
    # Chave utilizada no header de autenticação em requisições
    chave = models.CharField(max_length=255)
    # Ex.: 401200******1112
    cartao_truncado = models.CharField(max_length=16)
    # Booleano indicando se o cartão foi validado
    is_valido = models.BooleanField(default=False, null=False)

class TransacaoPJBank(models.Model):
    """
    Modelo que guarda as informações relativas a uma transação do PJBank.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    token_cartao = models.CharField(max_length=255)
    tid = models.CharField(max_length=255)
    previsao_credito = models.CharField(max_length=10)
    mensagem_status = models.CharField(max_length=255)
    tid_conciliacao = models.CharField(max_length=255)
    bandeira = models.CharField(max_length=40)
    autorizacao = models.CharField(max_length=40)
    cartao_truncado = models.CharField(max_length=16)
    status_cartao = models.CharField(max_length=3)
    tarifa = models.CharField(max_length=5)
    taxa = models.CharField(max_length=5)
    pedido_numero = models.CharField(max_length=32)
