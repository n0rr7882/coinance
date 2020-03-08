from django.contrib.auth.models import User
from django.db import models


class Wallet(models.Model):
    class Meta:
        db_table = 'wallets'
        verbose_name = '지갑'
        verbose_name_plural = f'{verbose_name} 목록'

    user = models.ForeignKey(
        verbose_name=User._meta.verbose_name,
        to=User,
        on_delete=models.CASCADE,
        related_name='wallets',
    )
    enabled = models.BooleanField(
        verbose_name='활성화 여부',
        default=True,
    )

    def __str__(self):
        return f'Wallet of {self.user}'
