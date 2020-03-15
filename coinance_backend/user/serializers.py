from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from rest_framework import serializers

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

    def validate_start_currency(self, value: Currency):
        if not value.available_for_start:
            raise ValidationError('초기자금 화폐로 선택할 수 없습니다.')

        return value


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
