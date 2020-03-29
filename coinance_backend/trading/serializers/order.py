import logging

from decimal import Decimal

from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from currency.models import CurrencyPair
from currency.serializers.currency_pair import CurrencyPairSerializer
from trading.models import Order

logger = logging.getLogger(__name__)


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            'id',
            'currency_pair',
            'order_type',
            'status',
            'price',
            'amount',
            'traded',
            'created',
            'modified',
        ]
        read_only_fields = [
            'status',
            'traded',
            'created',
            'modified',
        ]

    def to_representation(self, instance):
        self.fields['currency_pair'] = CurrencyPairSerializer(read_only=True)
        return super().to_representation(instance)

    def validate_price(self, value: Decimal):
        if value <= Decimal('0'):
            raise ValidationError(detail='0 이상의 수량을 입력해주세요.')

        return value

    def validate_amount(self, value: Decimal):
        if value <= Decimal('0'):
            raise ValidationError(detail='0 이상의 금액을 입력해주세요.')

        return value

    def validate(self, attrs):
        user: User = self.context['request'].user
        currency_pair: CurrencyPair = attrs['currency_pair']
        order_type: str = attrs['order_type']
        amount: Decimal = attrs['amount']
        price: Decimal = attrs['price']

        if order_type == Order.ORDER_TYPES.buy:
            wallet_from = user.wallets.get(currency=currency_pair.currency_from)
            if wallet_from.available_amount < price * amount:
                raise ValidationError(detail='매수에 필요한 금액이 부족합니다.')

        elif order_type == Order.ORDER_TYPES.sell:
            wallet_to = user.wallets.get(currency=currency_pair.currency_to)
            if wallet_to.available_amount < amount:
                raise ValidationError(detail='매도할 수량이 부족합니다.')

        else:
            raise NotImplementedError

        return attrs
