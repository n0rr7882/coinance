from django.contrib.auth.models import User
from django.db import models
from model_utils.models import TimeStampedModel


class UserSetting(TimeStampedModel):
    class Meta:
        db_table = 'user_settings'
        verbose_name = '사용자 설정'
        verbose_name_plural = f'{verbose_name} 목록'

    user = models.OneToOneField(
        verbose_name=User._meta.verbose_name,
        to=User,
        on_delete=models.CASCADE,
        related_name='setting',
    )
    nickname = models.CharField(
        verbose_name='닉네임',
        max_length=255,
    )
    start_currency = models.ForeignKey(
        verbose_name='초기자금 화폐',
        to='currency.Currency',
        on_delete=models.CASCADE,
        related_name='user_settings_started_with',
    )
    start_amount = models.FloatField(
        verbose_name='초기자금 금액',
    )

    def __str__(self):
        return f'{self.user}: {self.nickname} started with {self.start_amount}({self.start_currency})'
