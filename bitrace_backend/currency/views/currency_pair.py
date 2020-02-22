from rest_framework.viewsets import ModelViewSet

from currency.models import CurrencyPair
from currency.serializers.currency_pair import CurrencyPairSerializer


class CurrencyPairViewSet(ModelViewSet):
    queryset = CurrencyPair.objects.all()
    serializer_class = CurrencyPairSerializer
