# Generated by Django 2.2.10 on 2020-03-22 18:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trading', '0002_auto_20200322_0127'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='traded',
            field=models.DateTimeField(null=True, verbose_name='체결일시'),
        ),
    ]
