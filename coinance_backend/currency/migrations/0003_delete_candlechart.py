# Generated by Django 2.2.10 on 2020-02-29 11:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('currency', '0002_candlechart'),
    ]

    operations = [
        migrations.DeleteModel(
            name='CandleChart',
        ),
    ]