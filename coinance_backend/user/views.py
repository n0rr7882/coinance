from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.request import Request
from rest_framework.response import Response

from trading.processes.wallet import initialize_user_wallets
from user.models import UserSetting
from user.serializers import UserSerializer, UserSettingSerializer
from utils.permissions import IsAdminUserOrOwner
from utils.viewsets import ModelWithoutListViewSet


class UserSettingViewSet(ModelWithoutListViewSet):
    queryset = UserSetting.objects.all()
    serializer_class = UserSettingSerializer
    permission_classes = [IsAdminUserOrOwner]

    def perform_create(self, serializer: UserSettingSerializer):
        created = serializer.save(user=self.request.user)
        initialize_user_wallets(created)

        return


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request: Request) -> Response:
    return Response(data=UserSerializer(request.user).data, status=status.HTTP_200_OK)
