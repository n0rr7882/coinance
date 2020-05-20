from decimal import Decimal

from django.contrib.auth.models import User
from django.db import models
from django.db.models import Sum, F
from django.db.models.functions import Coalesce
from model_utils.models import TimeStampedModel

from currency.models import Currency
from trading.models.order import Order


class Wallet(TimeStampedModel):
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
    currency = models.ForeignKey(
        verbose_name=Currency._meta.verbose_name,
        to=Currency,
        on_delete=models.CASCADE,
        related_name='wallets',
    )
    amount = models.DecimalField(
        verbose_name='잔액',
        max_digits=20,
        decimal_places=8,
        default=0,
    )

    def __str__(self):
        return f'{self.user} {self.amount}({self.currency})'

    @property
    def available_amount(self) -> Decimal:
        if self.amount == 0:
            return Decimal('0')

        amount_in_buying_transaction = (
            self.user.orders
            .filter(status=Order.STATUSES.ordered, order_type=Order.ORDER_TYPES.buy)
            .filter(currency_pair__currency_from=self.currency)
            .aggregate(sum=Coalesce(Sum(F('amount') * F('price')), 0))['sum']
        )
        amount_in_selling_transaction = (
            self.user.orders
            .filter(status=Order.STATUSES.ordered, order_type=Order.ORDER_TYPES.sell)
            .filter(currency_pair__currency_to=self.currency)
            .aggregate(sum=Coalesce(Sum('amount'), 0))['sum']
        )

        return (
            self.amount
            - Decimal(str(amount_in_buying_transaction))
            - Decimal(str(amount_in_selling_transaction))
        )
