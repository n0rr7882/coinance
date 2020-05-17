from rest_framework import serializers

from currency.models import CurrencyPair
from currency.serializers.currency import CurrencySerializer
from currency.serializers.exchange_rate import ExchangeRateSerializer


class CurrencyPairSerializer(serializers.ModelSerializer):
    currency_from = CurrencySerializer()
    currency_to = CurrencySerializer()
    exchange_rate = ExchangeRateSerializer()

    class Meta:
        model = CurrencyPair
        fields = [
            'id',
            'poloniex_id',
            'currency_from',
            'currency_to',
            'commission_rate',
            'exchange_rate',
        ]
