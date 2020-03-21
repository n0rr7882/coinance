import logging

from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.layers import get_channel_layer
from channels_redis.core import RedisChannelLayer
from django.contrib.auth.models import User
from rest_framework_simplejwt.authentication import JWTAuthentication

from trading.models import Order
from trading.serializers.order import OrderSerializer

logger = logging.getLogger(__name__)


def to_ws_group_name(user_id: int) -> str:
    return f'order-processed.{user_id}'


def broadcast_ws_order_precessed(order: Order):
    message_type = 'order_processed'
    serialized = OrderSerializer(instance=order)
    message = {
        'type': message_type,
        'data': serialized.data,
    }

    channel_layer: RedisChannelLayer = get_channel_layer()
    group_name = to_ws_group_name(order.user.pk)
    async_to_sync(channel_layer.group_send)(group_name, message)

    return


class OrderConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.accept()

        return

    async def disconnect(self, code):
        for group_name in self.groups:
            await self.channel_layer.group_discard(group_name, self.channel_name)

        return

    async def receive_json(self, content, **kwargs):
        # 'subscription' / 'unsubscription'
        message_type = content['type']

        if message_type == 'subscription':
            access_token = content['access']
            await self.subscribe_order(access_token)

        elif message_type == 'unsubscription':
            user_id = int(content['user_id'])
            await self.unsubscribe_order(user_id)

        else:
            raise NotImplementedError

        return

    async def subscribe_order(self, access_token: str):
        jwt_authentication = JWTAuthentication()
        validated_token = jwt_authentication.get_validated_token(access_token)
        user: User = await database_sync_to_async(jwt_authentication.get_user)(validated_token)
        group_name = to_ws_group_name(user.pk)

        await self.channel_layer.group_add(group_name, self.channel_name)

        return

    async def unsubscribe_order(self, user_id: int):
        group_name = str(user_id)

        await self.channel_layer.group_discard(group_name, self.channel_name)

        return

    async def order_processed(self, event):
        await self.send(event)

        return
