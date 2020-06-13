from datetime import datetime
from decimal import Decimal

from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ReadOnlyModelViewSet

from currency.serializers.currency import CurrencySerializer
from trading.models import Wallet
from trading.serializers.wallet import WalletSerializer
from user.models import UserSetting


class WalletViewSet(ReadOnlyModelViewSet):
    queryset = Wallet.objects.exclude(amount=Decimal('0'))
    serializer_class = WalletSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user).select_related(
            'user', 'user__setting', 'user__setting__start_currency'
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def wallet_summary_view(request: Request):
    user: User = request.user

    if not UserSetting.objects.filter(user=user).exists():
        raise ValidationError(detail='사용자 설정을 먼저 진행해주세요.')

    start_currency = user.setting.start_currency
    start_amount = user.setting.start_amount

    wallets = user.wallets.exclude(amount=Decimal('0')).select_related('currency', 'user__setting__start_currency')
    total = sum(map(lambda w: w.aggregated_amount_to_start_currency_price, wallets))
    count = wallets.count()

    profit_amount = total - start_amount
    profit_rate = profit_amount / start_amount

    return Response({
        'start_currency': CurrencySerializer(start_currency).data,
        'start_amount': start_amount,
        'total': total,
        'count': count,
        'profit_amount': profit_amount,
        'profit_rate': profit_rate,
        'aggregated': datetime.now(),
    }, status=status.HTTP_200_OK)
