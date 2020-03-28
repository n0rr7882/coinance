from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated

from trading.models import Order
from trading.serializers.order import OrderSerializer
from trading.websocket.order import broadcast_ws_order_created, broadcast_ws_order_cancelled
from trading.websocket.wallet import broadcast_ws_wallet_updated
from utils.viewsets import ModelWithoutUpdateViewSet


class OrderViewSet(ModelWithoutUpdateViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['currency_pair', 'order_type', 'status']

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer: OrderSerializer):
        order: Order = serializer.save(user=self.request.user)
        broadcast_ws_order_created(order)

        from_wallet = order.currency_pair.currency_from.wallets.get(user=order.user)
        broadcast_ws_wallet_updated(from_wallet)

        return

    def perform_destroy(self, instance: Order):
        if instance.status == Order.STATUSES.traded:
            raise ValidationError(detail='이미 처리된 주문입니다.')

        elif instance.status == Order.STATUSES.cancelled:
            raise ValidationError(detail='이미 최소된 주문입니다.')

        instance.cancel()
        broadcast_ws_order_cancelled(instance)

        from_wallet = instance.currency_pair.currency_from.wallets.get(user=instance.user)
        broadcast_ws_wallet_updated(from_wallet)

        return
