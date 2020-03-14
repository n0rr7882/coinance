import { observable, action } from "mobx";
import { toast } from 'react-toastify';
import { CurrencyPair } from "../models/currency-pair";
import { ChartType, CandleStick } from "../models/candle-chart";
import { candleChartRepository } from "../repositories/candle-chart";
import { toTimestamp } from "../utils/timestamp";
import { boundClass } from "autobind-decorator";

@boundClass
export default class CandleChartStore {
  private fetchInterval = 30;

  @observable public chartType: ChartType = ChartType.daily;
  @observable public candleSticks: CandleStick[] = [];
  @observable private subscribed: boolean = false;
  private timer: any;

  @action
  private async loadCandleSticks(currencyPair: CurrencyPair) {
    try {
      this.candleSticks = await candleChartRepository.getCandleSticks(currencyPair, this.chartType);
    } catch (e) {
      toast(`차트 데이터를 가져오는 도중 오류가 발생했습니다: ${e}`);
    }
  }

  private candleSticksTimer(currencyPair: CurrencyPair) {
    if (this.subscribed) {
      this.loadCandleSticks(currencyPair);

      const current = toTimestamp(new Date());
      const base = Math.floor(current / this.fetchInterval) * this.fetchInterval
      const next = base + this.fetchInterval;

      console.log({ base, current, next });

      this.timer = setTimeout(() => this.candleSticksTimer(currencyPair), (next - current) * 1000);
    }
  }

  private setDefaultState() {
    this.candleSticks = [];
    this.chartType = ChartType.daily;
  }

  @action
  public subscribe(currencyPair: CurrencyPair, chartType: ChartType) {
    this.setDefaultState();
    this.subscribed = true;
    this.chartType = chartType;
    this.candleSticksTimer(currencyPair);
  }

  @action
  public unsubscribe() {
    this.subscribed = false;
    clearTimeout(this.timer);
    this.setDefaultState();
  }
}