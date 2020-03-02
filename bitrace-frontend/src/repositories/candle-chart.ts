import axios from 'axios';
import { BITRACE_API_ENTRY_POINT } from '../constants';
import { ICandleChart } from '../interfaces/candle-chart';

const CANDLE_CHART_API_ENTRY_POINT = `${BITRACE_API_ENTRY_POINT}/currency/candle-charts`;

class CandleChartRepository {
  private api = axios.create({ baseURL: CANDLE_CHART_API_ENTRY_POINT });

  public findByCurrencyPairId(id: number) {
    return this.api.get<ICandleChart[]>(`/${id}/`);
  };
}

export default new CandleChartRepository();
