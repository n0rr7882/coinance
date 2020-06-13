from datetime import datetime, timedelta
from decimal import Decimal

from django.db import models
from model_utils.models import TimeStampedModel, SoftDeletableModel


class CurrencyPair(TimeStampedModel, SoftDeletableModel):
    class Meta:
        db_table = 'currency_pairs'
        verbose_name = 'Poloniex 화폐 페어'
        verbose_name_plural = f'{verbose_name} 목록'
        unique_together = ('currency_from', 'currency_to',)

    poloniex_id = models.IntegerField(
        verbose_name='Poloniex 화폐 페어 ID',
        unique=True,
    )
    currency_from = models.ForeignKey(
        verbose_name='From 화폐',
        to='currency.Currency',
        on_delete=models.CASCADE,
        related_name='currency_pairs_as_from',
    )
    currency_to = models.ForeignKey(
        verbose_name='To 화폐',
        to='currency.Currency',
        on_delete=models.CASCADE,
        related_name='currency_pairs_as_to',
    )
    commission_rate = models.DecimalField(
        verbose_name='수수료율',
        max_digits=8,
        decimal_places=8,
        default=Decimal('0.0005'),
    )

    def __str__(self):
        return f'{self.currency_from}-{self.currency_to}({self.poloniex_id})'

    def to_poloniex_format(self) -> str:
        return f'{self.currency_from.symbol}_{self.currency_to.symbol}'

    def to_ws_group_name(self) -> str:
        return f'currency-pair.{self.pk}'

    @property
    def exchange_rate_registered(self):
        from currency.models import ExchangeRate

        return ExchangeRate.objects.filter(currency_pair=self).exists()

    @classmethod
    def is_exchange_rate_update_able(cls, poloniex_id: int) -> bool:
        seconds_ago_for_throttle = datetime.now() - timedelta(seconds=3)

        return (
            cls.objects
            .filter(poloniex_id=poloniex_id)
            .exclude(exchange_rate__modified__gt=seconds_ago_for_throttle)
            .exists()
        )
