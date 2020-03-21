from celery import shared_task

from currency.models import ExchangeRate
from trading.models import Order


def process_able_orders(exchange_rate: ExchangeRate):
    orders = Order.get_process_able_orders(exchange_rate)

    for order in orders:
        order.process()

    return


@shared_task
def process_able_orders_task(exchange_rate_id: int):
    exchange_rate = ExchangeRate.objects.get(pk=exchange_rate_id)
    process_able_orders(exchange_rate)

    return
