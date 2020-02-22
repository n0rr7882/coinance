from rest_framework import serializers

from currency.models import Currency


class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = [
            'id',
            'poloniex_id',
            'symbol',
            'name',
        ]
