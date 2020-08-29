# Generated by Django 3.1 on 2020-08-29 21:09

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0007_auto_20200829_1808'),
    ]

    operations = [
        migrations.CreateModel(
            name='Kit',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=48)),
                ('descricao', models.CharField(blank=True, max_length=200, null=True)),
                ('data_criacao', models.DateField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='MensagemSite',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=128)),
                ('email', models.EmailField(max_length=254)),
                ('mensagem', models.CharField(max_length=200)),
                ('data_criacao', models.DateField(auto_now_add=True)),
            ],
            options={
                'verbose_name_plural': 'Mensagens do site',
            },
        ),
        migrations.CreateModel(
            name='Produto',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=128)),
                ('preco', models.FloatField()),
                ('qntd_estoque', models.PositiveIntegerField(default=0)),
                ('descricao', models.CharField(max_length=200)),
                ('medidas', models.CharField(blank=True, max_length=32, null=True)),
                ('data_criacao', models.DateField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='ItemKit',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('qntd', models.PositiveIntegerField(default=1)),
                ('kit', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='webapp.kit')),
                ('produto', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='webapp.produto')),
            ],
            options={
                'verbose_name_plural': 'Itens em kits',
            },
        ),
        migrations.CreateModel(
            name='AvaliacaoCliente',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titulo', models.CharField(max_length=48)),
                ('texto', models.CharField(max_length=200)),
                ('pontuacao', models.PositiveIntegerField(default=5, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(5)])),
                ('data_criacao', models.DateField(auto_now_add=True)),
                ('cliente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('produto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='webapp.produto')),
            ],
            options={
                'verbose_name_plural': 'Avaliações dos produtos',
            },
        ),
    ]
