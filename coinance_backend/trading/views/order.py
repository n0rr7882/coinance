from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated

from trading.models import Order
from trading.serializers.order import OrderSerializer
from utils.viewsets import ModelWithoutUpdateViewSet


class OrderViewSet(ModelWithoutUpdateViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    authentication_classes = [IsAuthenticated]
    filterset_fields = ['currency_pair', 'order_type', 'status']

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer: OrderSerializer):
        serializer.save(user=self.request.user)

        return

    def perform_destroy(self, instance: Order):
        if instance.status == Order.STATUSES.traded:
            raise ValidationError(detail='이미 처리된 주문입니다.')

        elif instance.status == Order.STATUSES.cancelled:
            raise ValidationError(detail='이미 최소된 주문입니다.')

        instance.cancel()

        return
