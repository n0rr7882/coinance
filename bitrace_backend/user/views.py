from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from user.serializers import UserSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request: Request) -> Response:
    return Response(data=UserSerializer(request.user).data, status=status.HTTP_200_OK)
