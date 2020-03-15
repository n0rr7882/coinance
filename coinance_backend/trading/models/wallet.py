from django.contrib.auth.models import User
from django.db import models
from django.db.models import Q, Sum
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
    amount = models.FloatField(
        verbose_name='잔액',
        default=0,
    )

    def __str__(self):
        return f'{self.user} {self.amount}({self.currency})'

    @property
    def available_amount(self) -> float:
        q_buy = Q(currency_pair__currency_from=self.currency, order_type=Order.ORDER_TYPES.buy)
        q_sell = Q(currency_pair__currency_to=self.currency, order_type=Order.ORDER_TYPES.sell)

        amount_in_transaction = (
            self.user.orders
            .filter(status=Order.STATUSES.ordered)
            .filter(q_buy | q_sell)
            .aggregate(Sum('amount'))['amount__sum']
        )

        return self.amount - amount_in_transaction
