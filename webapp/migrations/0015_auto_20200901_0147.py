# Generated by Django 3.1 on 2020-09-01 04:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0014_blogpost'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='blogpost',
            options={'verbose_name': 'Artigo do blog', 'verbose_name_plural': 'Artigos do blog'},
        ),
    ]
