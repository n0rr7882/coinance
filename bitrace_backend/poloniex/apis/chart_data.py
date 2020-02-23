import logging

import datetime
from typing import List

import requests
from dateutil.relativedelta import relativedelta
from django.conf import settings

from currency.models import CurrencyPair, CandleChart
from poloniex.dataclasses.chart_data import CandleChartData
from utils.exceptions import PoloniexAPIException

logger = logging.getLogger(__name__)


FIRST_BITCOIN_ISSUED_DATETIME = datetime.datetime(2009, 1, 3)


class ChartDataAPI:
    def __init__(self, currency_pair: CurrencyPair):
        self.currency_pair = currency_pair

    def _get_chart_data_payload(self,
                                start: datetime.datetime,
                                end: datetime.datetime):
        return dict(
            command='returnChartData',
            currencyPair=self.currency_pair.to_poloniex_format(),
            start=start.timestamp(),
            end=end.timestamp(),
            resolution='auto',
        )

    def chart(self, chart_type: str) -> List[CandleChartData]:
        if chart_type == CandleChart.CHART_TYPES.full:
            return self.full_chart

        elif chart_type == CandleChart.CHART_TYPES.yearly:
            return self.yearly_chart

        elif chart_type == CandleChart.CHART_TYPES.monthly:
            return self.monthly_chart

        elif chart_type == CandleChart.CHART_TYPES.weekly:
            return self.weekly_chart

        elif chart_type == CandleChart.CHART_TYPES.daily:
            return self.daily_chart

        else:
            raise NotImplementedError

    @property
    def full_chart(self) -> List[CandleChartData]:
        end = datetime.datetime.now()
        start = FIRST_BITCOIN_ISSUED_DATETIME

        payload = self._get_chart_data_payload(start, end)
        chart_data_list = self._request_chart_data(payload)

        return chart_data_list

    @property
    def yearly_chart(self) -> List[CandleChartData]:
        end = datetime.datetime.now()
        start = end - datetime.timedelta(days=365)

        payload = self._get_chart_data_payload(start, end)
        chart_data_list = self._request_chart_data(payload)

        return chart_data_list

    @property
    def monthly_chart(self) -> List[CandleChartData]:
        end = datetime.datetime.now()
        start = end - relativedelta(months=1)

        payload = self._get_chart_data_payload(start, end)
        chart_data_list = self._request_chart_data(payload)

        return chart_data_list

    @property
    def weekly_chart(self) -> List[CandleChartData]:
        end = datetime.datetime.now()
        start = end - datetime.timedelta(days=7)

        payload = self._get_chart_data_payload(start, end)
        chart_data_list = self._request_chart_data(payload)

        return chart_data_list

    @property
    def daily_chart(self) -> List[CandleChartData]:
        end = datetime.datetime.now()
        start = end - datetime.timedelta(hours=24)

        payload = self._get_chart_data_payload(start, end)
        chart_data_list = self._request_chart_data(payload)

        return chart_data_list

    @staticmethod
    def _request_chart_data(payload: dict) -> List[CandleChartData]:
        response = requests.get(settings.POLONIEX_API_URL, params=payload)

        if response.status_code != 200:
            message = f'Poloniex API responded with {response.status_code}: {response.text}'
            raise PoloniexAPIException(message)

        chart_data_list = list(map(CandleChartData.from_raw, response.json()))

        return chart_data_list
