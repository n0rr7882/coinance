from rest_framework.viewsets import ReadOnlyModelViewSet

from currency.models import CurrencyPair
from currency.serializers.currency_pair import CurrencyPairSerializer


class CurrencyPairViewSet(ReadOnlyModelViewSet):
    queryset = CurrencyPair.objects.all()
    serializer_class = CurrencyPairSerializer
