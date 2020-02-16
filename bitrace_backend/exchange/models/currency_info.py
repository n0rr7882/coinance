from django.db import models


class CurrencyInfo(models.Model):
    class Meta:
        db_table = 'currency_infos'
        verbose_name = '암호화폐 정보'
        verbose_name_plural = f'{verbose_name} 목록'

    verbose_name = models.CharField(
        verbose_name='화폐명',
        max_length=255,
    )
    symbol = models.CharField(
        verbose_name='화폐 심볼',
        help_text='3 ~ 5글자의 대문자 알파벳으로 이루어집니다.(e.g. BTC)',
        max_length=10,
    )
    crawl_minutely = models.BooleanField(
        verbose_name='분당 크롤링 여부',
        default=True,
    )
    crawl_hourly = models.BooleanField(
        verbose_name='시간당 크롤링 여부',
        default=True,
    )
    crawl_daily = models.BooleanField(
        verbose_name='일일 크롤링 여부',
        default=True,
    )
    created_datetime = models.DateTimeField(
        verbose_name='생성 일시',
        auto_now_add=True,
    )
