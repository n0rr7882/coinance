from django.contrib import admin

from currency.models import CandleChart


@admin.register(CandleChart)
class CandleChartAdmin(admin.ModelAdmin):
    pass
