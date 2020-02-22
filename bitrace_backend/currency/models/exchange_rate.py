from django.db import models
from model_utils.models import TimeStampedModel

from .currency_pair import CurrencyPair


class ExchangeRate(TimeStampedModel):
    class Meta:
        db_table = 'exchange_rates'
        verbose_name = '실시간 시세 데이터'
        verbose_name_plural = f'{verbose_name} 목록'

    currency_pair = models.OneToOneField(
        verbose_name=f'{CurrencyPair._meta.verbose_name}',
        to='currency.CurrencyPair',
        on_delete=models.CASCADE,
        related_name='exchange_rate',
    )
    last_trade_price = models.FloatField(
        verbose_name='최근 체결가',
    )
    lowest_ask = models.FloatField(
        verbose_name='최저 매수가',
    )
    highest_bid = models.FloatField(
        verbose_name='최고 매도가',
    )
    change_rate_24h = models.FloatField(
        verbose_name='24시간 변동율',
    )
    base_volume_24h = models.FloatField(
        verbose_name='24시간 기본 볼륨',
    )
    quote_volume_24h = models.FloatField(
        verbose_name='24시간 시세 볼륨',
    )
    market_active = models.BooleanField(
        verbose_name='시장 활성화 여부',
    )
    highest_trade_price_24h = models.FloatField(
        verbose_name='24시간 최고 체결가',
    )
    lowest_trade_price_24h = models.FloatField(
        verbose_name='24시간 최저 체결가',
    )

    def __str__(self):
        return f'{self.currency_pair} 시세 at {self.modified}'
