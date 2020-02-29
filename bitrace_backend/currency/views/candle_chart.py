from django.core.cache import cache
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound
from rest_framework.generics import get_object_or_404
from rest_framework.request import Request
from rest_framework.response import Response

from currency.models import CurrencyPair
from poloniex.apis import CandleChartAPI


@api_view(['GET'])
def candle_chart_view(request: Request, currency_pair_id: int, chart_type: str) -> Response:
    currency_pair: CurrencyPair = get_object_or_404(CurrencyPair.objects.all(), pk=currency_pair_id)

    try:
        candle_chart_list = cache.get_or_set(
            currency_pair.to_chart_cache_key(chart_type),
            list(map(lambda c: c.serialize(), CandleChartAPI(currency_pair).chart(chart_type))),
            timeout=60,
        )

    except NotImplementedError:
        raise NotFound(detail="The param `chart_type` can only be 'full', 'yearly', 'monthly', 'weekly', 'daily'.")

    return Response(candle_chart_list, status.HTTP_200_OK)
