from decimal import Decimal

from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ReadOnlyModelViewSet

from trading.models import Wallet
from trading.serializers.wallet import WalletSerializer


class WalletViewSet(ReadOnlyModelViewSet):
    queryset = Wallet.objects.exclude(amount=Decimal('0'))
    serializer_class = WalletSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user).select_related(
            'user', 'user__setting', 'user__setting__start_currency'
        )
