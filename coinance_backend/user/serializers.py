from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from currency.models import Currency
from user.models import UserSetting


class UserSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSetting
        fields = [
            'id',
            'user',
            'nickname',
            'start_currency',
            'start_amount',
        ]
        read_only_fields = [
            'user',
        ]

    def validate_nickname(self, value: str):
        if not 2 <= len(value) <= 30:
            raise ValidationError(detail='2자 이상, 30자 이내의 닉네임을 입력해주세요.')

        charset_for_validate = '~`!@#$%^&*()-+=\\|{}[]\'\";:/?<>'

        if any(c in charset_for_validate for c in value):
            raise ValidationError(detail='`_` 를 제외한 특수문자는 사용할 수 없습니다.')

        return value

    def validate_start_currency(self, value: Currency):
        if not value.available_for_start:
            raise ValidationError(detail='초기자금 화폐로 선택할 수 없습니다.')

        return value

    def validate(self, attrs: dict):
        start_amount: int = attrs['start_amount']
        start_currency: Currency = attrs['start_currency']
        maximum_amount = start_currency.maximum_amount_for_start or 0

        if maximum_amount < start_amount:
            raise ValidationError({
                'start_amount': [f'{maximum_amount} {start_currency.symbol} 보다 적은 금액을 선택해주세요.']
            })

        return attrs


class UserSerializer(serializers.ModelSerializer):
    setting = UserSettingSerializer()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'password',
            'first_name',
            'last_name',
            'email',
            'is_staff',
            'is_superuser',
            'is_active',
            'date_joined',
            'setting',
        ]
        read_only_fields = [
            'is_staff',
            'is_active',
            'date_joined',
            'last_login',
            'setting',
        ]
