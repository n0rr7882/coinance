import logging

from celery import shared_task

from currency.websocket.currency_pair import broadcast_ws_update_exchange_rate
from poloniex.dataclasses.ticker_data import TickerData
from currency.models import ExchangeRate, CurrencyPair

logger = logging.getLogger(__name__)


def get_exchange_rate(currency_pair: CurrencyPair) -> ExchangeRate:
    try:
        return currency_pair.exchange_rate

    except ExchangeRate.DoesNotExist:
        return ExchangeRate(currency_pair=currency_pair)


def update_exchange_rate_from_ticker_data(ticker_data: TickerData):
    currency_pair = CurrencyPair.objects.get(poloniex_id=ticker_data.currency_pair_id)
    exchange_rate = get_exchange_rate(currency_pair)

    exchange_rate.last_trade_price = ticker_data.last_trade_price
    exchange_rate.lowest_ask = ticker_data.lowest_ask
    exchange_rate.highest_bid = ticker_data.highest_bid
    exchange_rate.change_rate_24h = ticker_data.change_rate_24h
    exchange_rate.base_volume_24h = ticker_data.base_volume_24h
    exchange_rate.quote_volume_24h = ticker_data.quote_volume_24h
    exchange_rate.market_active = ticker_data.market_active
    exchange_rate.highest_trade_price_24h = ticker_data.highest_trade_price_24h
    exchange_rate.lowest_trade_price_24h = ticker_data.lowest_trade_price_24h

    exchange_rate.save()

    return exchange_rate


@shared_task
def update_exchange_rate_task(ticker_data_serialized: str):
    ticker_data = TickerData.deserialize(ticker_data_serialized)
    exchange_rate = update_exchange_rate_from_ticker_data(ticker_data)
    broadcast_ws_update_exchange_rate(exchange_rate)

    return
