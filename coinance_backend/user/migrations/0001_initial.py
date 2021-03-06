# Generated by Django 2.2.10 on 2020-03-15 17:57

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('currency', '0003_delete_candlechart'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='UserSetting',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('nickname', models.CharField(max_length=255, verbose_name='닉네임')),
                ('start_amount', models.FloatField(verbose_name='초기자금 금액')),
                ('start_currency', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_settings_started_with', to='currency.Currency', verbose_name='초기자금 화폐')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='setting', to=settings.AUTH_USER_MODEL, verbose_name='user')),
            ],
            options={
                'verbose_name': '사용자 설정',
                'verbose_name_plural': '사용자 설정 목록',
                'db_table': 'user_settings',
            },
        ),
    ]
