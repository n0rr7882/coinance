from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

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
        ]
        read_only_fields = [
            'is_staff',
            'is_active',
            'date_joined',
            'last_login',
        ]
