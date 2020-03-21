from celery import shared_task

from currency.models import ExchangeRate
from trading.models import Order
from trading.websocket.order import broadcast_ws_order_precessed


def process_able_orders(exchange_rate: ExchangeRate):
    orders = Order.get_process_able_orders(exchange_rate)

    for order in orders:
        order.process()
        broadcast_ws_order_precessed(order)

    return


@shared_task
def process_able_orders_task(exchange_rate_id: int):
    exchange_rate = ExchangeRate.objects.get(pk=exchange_rate_id)
    process_able_orders(exchange_rate)

    return
