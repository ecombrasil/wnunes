# Generated by Django 3.1 on 2020-09-01 20:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0015_auto_20200901_0147'),
    ]

    operations = [
        migrations.AddField(
            model_name='blogpost',
            name='imagem_capa',
            field=models.FileField(null=True, upload_to=''),
        ),
    ]
