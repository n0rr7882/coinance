from django.contrib import admin

from exchange.models import (
    CurrencyInfo,
    ExchangeRate,
)

admin.site.register(CurrencyInfo)
admin.site.register(ExchangeRate)
