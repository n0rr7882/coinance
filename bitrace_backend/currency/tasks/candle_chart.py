from celery import shared_task
from django.db import transaction

from currency.models import CurrencyPair
from currency.models.candle_chart import CandleChart
from poloniex.apis import ChartDataAPI
from poloniex.dataclasses.chart_data import CandleChartData


@shared_task
def update_all_candle_charts():
    all_currency_pairs = CurrencyPair.objects.all()

    for currency_pair in all_currency_pairs:
        update_candle_charts.delay(currency_pair.pk, CandleChart.CHART_TYPES.full)
        update_candle_charts.delay(currency_pair.pk, CandleChart.CHART_TYPES.yearly)
        update_candle_charts.delay(currency_pair.pk, CandleChart.CHART_TYPES.monthly)
        update_candle_charts.delay(currency_pair.pk, CandleChart.CHART_TYPES.weekly)
        update_candle_charts.delay(currency_pair.pk, CandleChart.CHART_TYPES.daily)

    return


@shared_task
@transaction.atomic
def update_candle_charts(currency_pair_id: int, chart_type: str) -> None:
    currency_pair = CurrencyPair.objects.get(pk=currency_pair_id)
    CandleChart.objects.filter(currency_pair=currency_pair, chart_type=chart_type).delete()

    candle_chart_data_list = ChartDataAPI(currency_pair).chart(chart_type)

    candle_chart_list = map(
        lambda c: _candle_chart_data_to_model(currency_pair, chart_type, c),
        candle_chart_data_list
    )
    CandleChart.objects.bulk_create(candle_chart_list)

    return


def _candle_chart_data_to_model(currency_pair: CurrencyPair,
                                chart_type: str,
                                candle_chart_data: CandleChartData) -> CandleChart:
    candle_chart = CandleChart(currency_pair=currency_pair, chart_type=chart_type)
    candle_chart.anchor_datetime = candle_chart_data.anchor_datetime
    candle_chart.price_open = candle_chart_data.price_open
    candle_chart.price_high = candle_chart_data.price_high
    candle_chart.price_low = candle_chart_data.price_low
    candle_chart.price_close = candle_chart_data.price_close
    candle_chart.volume_base = candle_chart_data.volume_base
    candle_chart.volume_quote = candle_chart_data.volume_quote
    candle_chart.price_average = candle_chart_data.price_average

    return candle_chart
