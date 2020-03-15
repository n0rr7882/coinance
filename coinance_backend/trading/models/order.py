from django.contrib.auth.models import User
from django.db import models, transaction
from model_utils import Choices

from currency.models import CurrencyPair


class Order(models.Model):
    class Meta:
        db_table = 'orders'
        verbose_name = '주문'
        verbose_name_plural = f'{verbose_name} 목록'

    STATUSES = Choices(
        'ordered',
        'traded',
        'cancelled',
    )
    ORDER_TYPES = Choices(
        'buy',
        'sell',
    )

    user = models.ForeignKey(
        verbose_name=User._meta.verbose_name,
        to=User,
        on_delete=models.CASCADE,
        related_name='orders',
    )
    currency_pair = models.ForeignKey(
        verbose_name=CurrencyPair._meta.verbose_name,
        to=CurrencyPair,
        on_delete=models.CASCADE,
        related_name='orders',
    )
    order_type = models.CharField(
        verbose_name='주문유형',
        max_length=5,
        choices=ORDER_TYPES,
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
        verbose_name='수량',
    )

    def __str__(self):
        return f'{self.currency_pair} {self.status} {self.amount}/{self.price} -> {self.user}'

    @transaction.atomic
    def process(self) -> None:
        wallet_from = self.user.wallets.get(currency=self.currency_pair.currency_from)
        wallet_to = self.user.wallets.get(currency=self.currency_pair.currency_to)

        if self.order_type == self.ORDER_TYPES.buy:
            wallet_from.amount -= self.price * self.amount
            wallet_to.amount += self.amount

        elif self.order_type == self.ORDER_TYPES.sell:
            wallet_from.amount += self.price * self.amount
            wallet_to.amount -= self.amount

        else:
            raise NotImplementedError

        wallet_from.asve()
        wallet_to.save()

        return

    def cancel(self) -> None:
        self.status = self.STATUSES.cancelled
        self.save()

        return
