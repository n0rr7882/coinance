from rest_framework import serializers

from currency.serializers.currency import CurrencySerializer
from trading.models import Wallet


class WalletSerializer(serializers.ModelSerializer):
    currency = CurrencySerializer()
    available_amount = serializers.SerializerMethodField()

    class Meta:
        model = Wallet
        fields = [
            'id',
            'currency',
            'amount',
            'available_amount',
            'created',
            'modified',
        ]

    def get_available_amount(self, obj: Wallet) -> float:
        return obj.available_amount
