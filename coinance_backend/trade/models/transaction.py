from django.db import models
from model_utils import Choices

from currency.models import CurrencyPair
from .wallet import Wallet


class Transaction(models.Model):
    class Meta:
        db_table = 'transactions'
        verbose_name = '거래'
        verbose_name_plural = f'{verbose_name} 목록'

    STATUSES = Choices(
        'ordered',
        'traded',
        'cancelled',
    )

    wallet = models.ForeignKey(
        verbose_name=Wallet._meta.verbose_name,
        to=Wallet,
        on_delete=models.CASCADE,
        related_name='transactions',
    )
    currency_pair = models.ForeignKey(
        verbose_name=CurrencyPair._meta.verbose_name,
        to=CurrencyPair,
        on_delete=models.CASCADE,
        related_name='transactions',
    )
    status = models.CharField(
        verbose_name='상태',
        max_length=10,
        choices=STATUSES,
        default=STATUSES.ordered,
    )
    price = models.FloatField(
        verbose_name='가격',
    )
    amount = models.FloatField(
        verbose_name='구매수량',
    )

    def __str__(self):
        return f'{self.currency_pair} {self.status} {self.amount}/{self.price} -> {self.wallet}'
