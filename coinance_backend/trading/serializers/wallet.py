from rest_framework import serializers

from currency.serializers.currency import CurrencySerializer
from trading.models import Wallet


class WalletSerializer(serializers.ModelSerializer):
    currency = CurrencySerializer()

    class Meta:
        model = Wallet
        fields = [
            'id',
            'currency',
            'amount',
            'created',
            'modified',
        ]
