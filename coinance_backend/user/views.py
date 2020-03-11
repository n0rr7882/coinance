from django.contrib.auth.models import User
from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from user.permissions import IsSuperuserOrCreateAndUpdateOnly
from user.serializers import UserSerializer, ChangePasswordSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsSuperuserOrCreateAndUpdateOnly]


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request: Request) -> Response:
    return Response(data=UserSerializer(request.user).data, status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def change_password_view(request: Request) -> Response:
    user: User = request.user
    serialized = ChangePasswordSerializer(data=request.data)

    if not serialized.is_valid():
        raise ValidationError(serialized.errors)

    old_password = serialized.data.get('old_password')

    if not user.check_password(old_password):
        return Response({'old_password': ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(serialized.data.get('new_password'))
    user.save()

    return Response(status=status.HTTP_204_NO_CONTENT)
