import logging
from celery import shared_task

from currency.models import ExchangeRate
from trading.models import Order
from trading.websocket.order import broadcast_ws_order_precessed
from trading.websocket.wallet import broadcast_ws_wallet_updated

logger = logging.getLogger(__name__)


def process_able_orders(exchange_rate: ExchangeRate):
    orders = Order.get_process_able_orders(exchange_rate)

    for order in orders:
        order.process()
        broadcast_ws_order_precessed(order)

        from_wallet = order.currency_pair.currency_from.wallets.get(user=order.user)
        to_wallet = order.currency_pair.currency_to.wallets.get(user=order.user)
        broadcast_ws_wallet_updated(from_wallet)
        broadcast_ws_wallet_updated(to_wallet)

    return


@shared_task
def process_able_orders_task(exchange_rate_id: int):
    exchange_rate = ExchangeRate.objects.get(pk=exchange_rate_id)
    process_able_orders(exchange_rate)

    return


@shared_task
def process_able_orders_of_all_currency_pairs_task():
    for exchange_rate_id in ExchangeRate.objects.all().values_list('pk', flat=True):
        process_able_orders_task.delay(exchange_rate_id)

    return
