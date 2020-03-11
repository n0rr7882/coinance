from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
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

    def validate(self, data):
        user = User(**data)
        errors = dict()

        if 'password' in data:
            try:
                validate_password(password=data['password'], user=User)

            except ValidationError as e:
                errors['password'] = list(e.messages)

        if errors:
            raise serializers.ValidationError(errors)

        return super().validate(data)

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        user.save()

        return user

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            validated_data.pop('password')

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        return instance


class ChangePasswordSerializer(serializers.Serializer):
    def update(self, instance, validated_data):
        pass

    def create(self, validated_data):
        pass

    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        validate_password(value)
        return value