from rest_framework import serializers

from currency.models import ExchangeRate


class ExchangeRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExchangeRate
        fields = [
            'id',
            'currency_pair',
            'last_trade_price',
            'lowest_ask',
            'highest_bid',
            'change_rate_24h',
            'base_volume_24h',
            'quote_volume_24h',
            'market_active',
            'highest_trade_price_24h',
            'lowest_trade_price_24h',
        ]
