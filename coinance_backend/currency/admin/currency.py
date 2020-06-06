from django.contrib import admin

from currency.models import Currency


@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'poloniex_id',
        'symbol',
        'name',
        'available_for_start',
        'maximum_amount_for_start',
    ]
    list_editable = [
        'name',
        'available_for_start',
        'maximum_amount_for_start',
    ]
    list_filter = [
        'available_for_start',
    ]
    search_fields = [
        'symbol',
        'name',
    ]
