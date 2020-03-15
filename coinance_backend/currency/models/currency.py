from django.db import models
from model_utils.models import TimeStampedModel, SoftDeletableModel


class Currency(TimeStampedModel, SoftDeletableModel):
    class Meta:
        db_table = 'currencies'
        verbose_name = 'Poloniex 암호화폐'
        verbose_name_plural = f'{verbose_name} 목록'

    poloniex_id = models.IntegerField(
        verbose_name='Poloniex 화폐 ID',
        unique=True,
    )
    symbol = models.CharField(
        verbose_name='화폐 심볼',
        max_length=10,
        unique=True,
    )
    name = models.CharField(
        verbose_name='한글 화폐명',
        max_length=255,
    )
    available_for_start = models.BooleanField(
        verbose_name='초기자금 선택 가능 여부',
        default=False,
    )

    def __str__(self):
        return f'{self.name}({self.symbol})'
