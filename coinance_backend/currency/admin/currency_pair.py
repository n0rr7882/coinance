from django.contrib import admin

from currency.models import CurrencyPair


@admin.register(CurrencyPair)
class CurrencyPairAdmin(admin.ModelAdmin):
    pass
