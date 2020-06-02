import json
import signal
import logging

import websocket
from django.conf import settings
from django.core.management import BaseCommand

from poloniex.dataclasses.ticker_data import TickerData
from currency.models import CurrencyPair
from currency.tasks import update_exchange_rate_task
from trading.tasks import process_able_orders_task

logger = logging.getLogger(__name__)


TICKER_SUBSCRIPTION_PACKET = json.dumps({
    'command': 'subscribe',
    'channel': settings.POLONIEX_WS_TICKER_CHANNEL,
})
TICKER_UNSUBSCRIPTION_PACKET = json.dumps({
    'command': 'unsubscribe',
    'channel': settings.POLONIEX_WS_TICKER_CHANNEL,
})


def on_message(ws: websocket.WebSocket, message: str):
    payload = json.loads(message)
    health_check = payload[1]

    if health_check:
        logger.info(f'Health checked: {payload}')

        return

    raw_data = payload[2]
    ticker_data = TickerData.from_raw(raw_data)

    if CurrencyPair.is_exchange_rate_update_able(ticker_data.currency_pair_id):
        serialized = ticker_data.serialize()
        # celery task chaining: update rates -> process orders
        (update_exchange_rate_task.s(serialized) | process_able_orders_task.s())()

    return


def on_error(ws: websocket.WebSocket, error: Exception):
    logger.exception(error)

    return


def on_open(ws: websocket.WebSocket):
    ws.send(TICKER_SUBSCRIPTION_PACKET)

    return


class Command(BaseCommand):
    help = 'Poloniex websocket client for ticker API'

    def handle(self, *args, **options):
        websocket.enableTrace(True)
        ws = websocket.WebSocketApp(
            url=settings.POLONIEX_WS_URL,
            on_open=on_open,
            on_message=on_message,
            on_error=on_error,
        )

        def close_websocket(sig, frame):
            ws.send(TICKER_UNSUBSCRIPTION_PACKET)
            ws.keep_running = False
            return

        signal.signal(signal.SIGINT, close_websocket)
        signal.signal(signal.SIGTERM, close_websocket)

        ws.run_forever()

        return
