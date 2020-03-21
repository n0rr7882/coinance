from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from currency.models import CurrencyPair
from currency.serializers.currency_pair import CurrencyPairSerializer
from trading.models import Order


class OrderSerializer(serializers.ModelSerializer):
    currency_pair = CurrencyPairSerializer()

    class Meta:
        model = Order
        fields = [
            'id',
            'currency_pair',
            'order_type',
            'status',
            'price',
            'amount',
            'created',
            'modified',
        ]
        read_only_fields = [
            'status',
            'created',
            'modified',
        ]

    def validate(self, attrs):
        user: User = self.context['request'].user
        currency_pair: CurrencyPair = attrs['currency_pair']
        order_type: str = attrs['order_type']
        amount: float = attrs['amount']
        price: float = attrs['price']

        if order_type == Order.ORDER_TYPES.buy:
            wallet_from = user.wallets.get(currency=currency_pair.currency_from)
            if wallet_from.amount < price * amount:
                raise ValidationError(detail='매수에 필요한 금액이 부족합니다.')

        elif order_type == Order.ORDER_TYPES.sell:
            wallet_to = user.wallets.get(currency=currency_pair.currency_to)
            if wallet_to.amount < amount:
                raise ValidationError(detail='매도할 수량이 부족합니다.')

        else:
            raise NotImplementedError

        return attrs
