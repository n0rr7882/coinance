import axios from 'axios';
import { POLONIEX_API_ENTRY_POINT, FIRST_BITCOIN_ISSUED_DATETIME } from '../constants';
import { CandleStick, ChartType, ChartPeriod, ChartOption } from '../models/candle-chart';
import { CurrencyPair } from '../models/currency-pair';

const nowTimestamp = () => {
  return Math.floor(Date.now() / 1000);
}

const chartTypeOptionMap = {
  [ChartType.full]: new ChartOption(ChartPeriod.hours24, FIRST_BITCOIN_ISSUED_DATETIME.valueOf(), nowTimestamp()),
  [ChartType.yearly]: new ChartOption(ChartPeriod.hours24, nowTimestamp() - (ChartPeriod.hours24 * 365), nowTimestamp()),
  [ChartType.monthly]: new ChartOption(ChartPeriod.hours2, nowTimestamp() - (ChartPeriod.hours24 * 31), nowTimestamp()),
  [ChartType.weekly]: new ChartOption(ChartPeriod.minutes30, nowTimestamp() - (ChartPeriod.hours24 * 7), nowTimestamp()),
  [ChartType.daily]: new ChartOption(ChartPeriod.minutes5, nowTimestamp() - ChartPeriod.hours24, nowTimestamp()),
};

const getChartOpton = (currencyPair: CurrencyPair, chartType: ChartType) => {
  const chartOption = chartTypeOptionMap[chartType];
  chartOption.currencyPair = `${currencyPair.currency_from.symbol}_${currencyPair.currency_to.symbol}`;

  return chartOption;
}

class CandleChartRepository {
  private api = axios.create({ baseURL: POLONIEX_API_ENTRY_POINT });

  public async getCandleSticks(currencyPair: CurrencyPair, chartType: ChartType) {
    const chartOption = getChartOpton(currencyPair, chartType);
    const res = await this.api.get<CandleStick[]>(`/`, { params: chartOption });

    return res.data;
  };
}

export const candleChartRepository = new CandleChartRepository();
