import logging

import datetime
from typing import List

import requests
from dateutil.relativedelta import relativedelta
from django.conf import settings

from currency.models import CurrencyPair
from poloniex.dataclasses.chart_data import CandleChartData
from utils.exceptions import PoloniexAPIException

logger = logging.getLogger(__name__)


FIRST_BITCOIN_ISSUED_DATETIME = datetime.datetime(2009, 1, 3)


class CandleChartPeriods:
    minutes_5 = datetime.timedelta(minutes=5)
    minutes_15 = datetime.timedelta(minutes=15)
    minutes_30 = datetime.timedelta(minutes=30)
    hour_2 = datetime.timedelta(hours=2)
    hours_4 = datetime.timedelta(hours=4)
    hours_8 = datetime.timedelta(hours=8)
    hours_24 = datetime.timedelta(hours=24)


class CandleChartAPI:
    def __init__(self, currency_pair: CurrencyPair):
        self.currency_pair = currency_pair

    def _get_candle_chart_payload(self,
                                  start: datetime.datetime,
                                  end: datetime.datetime,
                                  period: datetime.timedelta = None):
        return dict(
            command='returnChartData',
            currencyPair=self.currency_pair.to_poloniex_format(),
            start=start.timestamp(),
            end=end.timestamp(),
            resolution='auto' if period is None else None,
            period=period.total_seconds(),
        )

    def chart(self, chart_type: str) -> List[CandleChartData]:
        if chart_type == 'full':
            return self.full_chart

        elif chart_type == 'yearly':
            return self.yearly_chart

        elif chart_type == 'monthly':
            return self.monthly_chart

        elif chart_type == 'weekly':
            return self.weekly_chart

        elif chart_type == 'daily':
            return self.daily_chart

        else:
            raise NotImplementedError

    @property
    def full_chart(self) -> List[CandleChartData]:
        end = datetime.datetime.now()
        start = FIRST_BITCOIN_ISSUED_DATETIME
        period = CandleChartPeriods.hours_24

        payload = self._get_candle_chart_payload(start, end, period=period)
        chart_data_list = self._request_chart_data(payload)

        return chart_data_list

    @property
    def yearly_chart(self) -> List[CandleChartData]:
        end = datetime.datetime.now()
        start = end - datetime.timedelta(days=365)
        period = CandleChartPeriods.hours_24

        payload = self._get_candle_chart_payload(start, end, period=period)
        chart_data_list = self._request_chart_data(payload)

        return chart_data_list

    @property
    def monthly_chart(self) -> List[CandleChartData]:
        end = datetime.datetime.now()
        start = end - relativedelta(months=1)
        period = CandleChartPeriods.hour_2

        payload = self._get_candle_chart_payload(start, end, period=period)
        chart_data_list = self._request_chart_data(payload)

        return chart_data_list

    @property
    def weekly_chart(self) -> List[CandleChartData]:
        end = datetime.datetime.now()
        start = end - datetime.timedelta(days=7)
        period = CandleChartPeriods.minutes_30

        payload = self._get_candle_chart_payload(start, end, period=period)
        chart_data_list = self._request_chart_data(payload)

        return chart_data_list

    @property
    def daily_chart(self) -> List[CandleChartData]:
        end = datetime.datetime.now()
        start = end - datetime.timedelta(hours=24)
        period = CandleChartPeriods.minutes_5

        payload = self._get_candle_chart_payload(start, end, period=period)
        chart_data_list = self._request_chart_data(payload)

        return chart_data_list

    @staticmethod
    def _request_chart_data(payload: dict) -> List[CandleChartData]:
        response = requests.get(settings.POLONIEX_API_URL, params=payload)

        if response.status_code != 200:
            message = f'Poloniex API responded with {response.status_code}: {response.text}'
            raise PoloniexAPIException(message)

        if type(response.json()) == dict and 'error' in response.json().keys():
            message = f'Poloniex API responded with 200 error: {response.text}'
            raise PoloniexAPIException(message)

        chart_data_list = list(map(CandleChartData.from_raw, response.json()))

        return chart_data_list
