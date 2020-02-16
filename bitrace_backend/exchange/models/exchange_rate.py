from django.db import models
from .currency_info import CurrencyInfo


class ExchangeRate(models.Model):
    class Meta:
        db_table = 'exchange_rates'
        verbose_name = '환율 정보'
        verbose_name_plural = f'{verbose_name} 목록'

    base_datetime = models.DateTimeField(
        verbose_name='기준 일시',
    )
    currency = models.ForeignKey(
        verbose_name='대상 화폐',
        help_text='해당 화폐 1 단위를 매수하기 위해 얼마의 KRW 가 필요한 지 기록됩니다.',
        to=CurrencyInfo,
        on_delete=models.CASCADE,
        related_name='exchange_rates'
    )
    value_open = models.FloatField(
        verbose_name='시가',
    )
    value_high = models.FloatField(
        verbose_name='고가',
    )
    value_low = models.FloatField(
        verbose_name='저가',
    )
    value_close = models.FloatField(
        verbose_name='종가',
    )
    value_volume = models.FloatField(
        verbose_name='거래량',
    )
    period = models.IntegerField(
        verbose_name='기간(분)',
    )
    created_datetime = models.DateTimeField(
        verbose_name='생성 일시',
        auto_now_add=True,
    )
