from django.contrib import admin

from currency.models import CurrencyPair


@admin.register(CurrencyPair)
class CurrencyPairAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'poloniex_id',
        'currency_from',
        'currency_to',
        'commission_rate',
    ]
    list_editable = [
        'commission_rate',
    ]
    search_fields = [
        'currency_from__symbol',
        'currency_to__symbol',
    ]
