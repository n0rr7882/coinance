from django.db import models
from model_utils import Choices
from model_utils.models import TimeStampedModel

from currency.models import CurrencyPair


class CandleChart(TimeStampedModel):
    CHART_TYPES = Choices(
        'full',
        'yearly',
        'monthly',
        'weekly',
        'daily',
    )

    class Meta:
        db_table = 'candle_charts'
        verbose_name = '캔들 차트 데이터'
        verbose_name_plural = f'{verbose_name} 목록'

    currency_pair = models.ForeignKey(
        verbose_name=CurrencyPair._meta.verbose_name,
        to=CurrencyPair,
        on_delete=models.CASCADE,
        related_name='candle_charts',
    )
    chart_type = models.CharField(
        verbose_name='차트 유형',
        max_length=10,
        choices=CHART_TYPES,
    )
    anchor_datetime = models.DateTimeField(
        verbose_name='기준일시',
    )
    price_open = models.FloatField(
        verbose_name='시가',
    )
    price_high = models.FloatField(
        verbose_name='고가',
    )
    price_low = models.FloatField(
        verbose_name='저가',
    )
    price_close = models.FloatField(
        verbose_name='종가',
    )
    volume_base = models.FloatField(
        verbose_name='베이스 볼륨',
    )
    volume_quote = models.FloatField(
        verbose_name='쿼트 볼륨',
    )
    price_average = models.FloatField(
        verbose_name='평균가',
    )

    def __str__(self):
        return f'Candle of {self.currency_pair} at {self.anchor_datetime}'
