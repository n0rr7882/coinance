import json
import logging

from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.layers import get_channel_layer
from channels_redis.core import RedisChannelLayer

from currency.models import CurrencyPair, ExchangeRate
from currency.serializers.currency_pair import CurrencyPairSerializer

logger = logging.getLogger(__name__)


def broadcast_ws_update_exchange_rate(exchange_rate: ExchangeRate):
    message_type = 'update_exchange_rate'
    serialized = CurrencyPairSerializer(instance=exchange_rate.currency_pair)
    message = {
        'type': message_type,
        'data': serialized.data,
    }

    channel_layer: RedisChannelLayer = get_channel_layer()
    group_name = exchange_rate.currency_pair.to_ws_group_name()
    async_to_sync(channel_layer.group_send)(group_name, message)

    return


class CurrencyPairConsumer(AsyncJsonWebsocketConsumer):
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
        currency_pair_id = content['currency_pair_id']

        if message_type == 'subscription':
            await self.subscribe_currency_pair(currency_pair_id)

        elif message_type == 'unsubscription':
            await self.unsubscribe_currency_pair(currency_pair_id)

        else:
            raise NotImplementedError

        return

    async def subscribe_currency_pair(self, currency_pair_id: int):
        currency_pair: CurrencyPair = await database_sync_to_async(CurrencyPair.objects.get)(pk=currency_pair_id)
        group_name = currency_pair.to_ws_group_name()

        await self.channel_layer.group_add(group_name, self.channel_name)

        return

    async def unsubscribe_currency_pair(self, currency_pair_id: int):
        currency_pair: CurrencyPair = await database_sync_to_async(CurrencyPair.objects.get)(pk=currency_pair_id)
        group_name = currency_pair.to_ws_group_name()

        await self.channel_layer.group_discard(group_name, self.channel_name)

        return

    async def update_exchange_rate(self, event):
        await self.send_json(event)

        return
