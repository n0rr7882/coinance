from rest_framework.viewsets import ReadOnlyModelViewSet

from currency.models import Currency
from currency.serializers.currency import CurrencySerializer


class CurrencyViewSet(ReadOnlyModelViewSet):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer
    filterset_fields = ['available_for_start']
