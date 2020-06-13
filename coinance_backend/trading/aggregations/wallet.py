import logging

from decimal import Decimal, ROUND_DOWN
from queue import Queue
from typing import List

from currency.models import Currency, CurrencyPair
from trading.models import Wallet

logger = logging.getLogger(__name__)


def aggregate_wallet_amount_to_start_currency_price(wallet: Wallet):
    from_currency = wallet.currency
    to_currency = wallet.user.setting.start_currency

    return (
        wallet.amount / aggregate_weighted_price(from_currency, to_currency)
    ).quantize(Decimal('0.00000001'), rounding=ROUND_DOWN)


class WeightedPriceQueueData:
    currency: Currency = None
    weighted_price: Decimal = None

    def __init__(self, currency: Currency, weighted_rate: Decimal):
        self.currency = currency
        self.weighted_price = weighted_rate


def aggregate_weighted_price(from_currency: Currency, to_currency: Currency) -> Decimal:
    currency_pairs = list(CurrencyPair.objects.all().select_related('currency_from', 'currency_to', 'exchange_rate'))
    queue: Queue[WeightedPriceQueueData] = Queue()
    already_retrieved_currency_ids: List[int] = []

    queue.put(WeightedPriceQueueData(from_currency, Decimal('1')))

    while not queue.empty():
        last_retrieved = queue.get()
        already_retrieved_currency_ids.append(last_retrieved.currency.pk)

        if last_retrieved.currency.pk == to_currency.pk:
            return last_retrieved.weighted_price

        target_currency_pairs = list(filter(
            lambda c: last_retrieved.currency in [c.currency_from, c.currency_to],
            currency_pairs
        ))

        for currency_pair in target_currency_pairs:
            if _is_valid_to_retrieve(last_retrieved, currency_pair, already_retrieved_currency_ids):
                weighted_price_queue_data = _get_weighted_price_queue_data(last_retrieved, currency_pair)
                queue.put(weighted_price_queue_data)

    raise ValueError(f'{from_currency} -> {to_currency} 의 가격을 추적할 CurrencyPair 상 경로를 찾을 수 없습니다.')


def _is_valid_to_retrieve(last_retrieved: WeightedPriceQueueData, currency_pair: CurrencyPair,
                          already_retrieved_currency_ids: List[int]) -> bool:
    if not currency_pair.exchange_rate_registered:
        return False

    if (currency_pair.currency_from == last_retrieved.currency
            and currency_pair.currency_to.pk in already_retrieved_currency_ids):
        return False

    if (currency_pair.currency_to == last_retrieved.currency
            and currency_pair.currency_from.pk in already_retrieved_currency_ids):
        return False

    return True


def _get_weighted_price_queue_data(last_retrieved: WeightedPriceQueueData,
                                   currency_pair: CurrencyPair) -> WeightedPriceQueueData:
    if currency_pair.currency_from == last_retrieved.currency:
        currency = currency_pair.currency_to
        weighted_price = last_retrieved.weighted_price * currency_pair.exchange_rate.last_trade_price
    else:
        currency = currency_pair.currency_from
        weighted_price = last_retrieved.weighted_price * (Decimal('1') / currency_pair.exchange_rate.last_trade_price)

    return WeightedPriceQueueData(currency, weighted_price)
