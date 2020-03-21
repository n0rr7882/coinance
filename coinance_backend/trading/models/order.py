from django.contrib.auth.models import User
from django.db import models, transaction
from django.db.models import Q
from model_utils import Choices

from currency.models import CurrencyPair, ExchangeRate


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

    @classmethod
    def get_process_able_orders(cls, exchange_rate: ExchangeRate):
        multiplier_for_sell = 1.02
        multiplier_for_buy = 0.98

        q_buy_able = Q(
            order_type=cls.ORDER_TYPES.buy,
            price__gte=exchange_rate.last_trade_price * multiplier_for_buy,
        )
        q_sell_able = Q(
            order_type=cls.ORDER_TYPES.sell,
            price__lte=exchange_rate.last_trade_price * multiplier_for_sell,
        )

        return (
            cls.objects
            .filter(status=cls.STATUSES.ordered, currency_pair=exchange_rate.currency_pair)
            .filter(q_buy_able | q_sell_able)
        )

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

        wallet_from.save()
        wallet_to.save()

        self.status = self.STATUSES.traded
        self.save()

        return

    def cancel(self) -> None:
        self.status = self.STATUSES.cancelled
        self.save()

        return
