# Generated by Django 3.1 on 2020-08-31 18:57

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0009_auto_20200830_1319'),
    ]

    operations = [
        migrations.AlterField(
            model_name='avaliacaocliente',
            name='pontuacao',
            field=models.PositiveIntegerField(default=5, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)], verbose_name='Pontuação (0-5)'),
        ),
    ]