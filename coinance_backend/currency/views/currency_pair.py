from rest_framework.viewsets import ReadOnlyModelViewSet

from currency.models import CurrencyPair
from currency.serializers.currency_pair import CurrencyPairSerializer


class CurrencyPairViewSet(ReadOnlyModelViewSet):
    queryset = CurrencyPair.objects.filter(exchange_rate__isnull=False)
    serializer_class = CurrencyPairSerializer
