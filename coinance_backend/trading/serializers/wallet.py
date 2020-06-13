from rest_framework import serializers

from currency.serializers.currency import CurrencySerializer
from trading.models import Wallet


class WalletSerializer(serializers.ModelSerializer):
    currency = CurrencySerializer()
    available_amount = serializers.SerializerMethodField()
    amount_aggregated_to_start_currency_price = serializers.SerializerMethodField()

    class Meta:
        model = Wallet
        fields = [
            'id',
            'currency',
            'amount',
            'available_amount',
            'aggregated_amount_to_start_currency_price',
            'created',
            'modified',
        ]

    def get_available_amount(self, obj: Wallet) -> float:
        return float(obj.available_amount)

    def get_aggregated_amount_to_start_currency_price(self, obj: Wallet) -> float:
        try:
            return float(obj.aggregated_amount_to_start_currency_price)
        except ValueError:
            return 0.0
