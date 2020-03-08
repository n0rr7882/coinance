import { observable, action } from "mobx";
import { CurrencyPair } from "../models/currency-pair";
import { ChartType, CandleStick, ChartPeriod } from "../models/candle-chart";
import { candleChartRepository } from "../repositories/candle-chart";
import { toTimestamp } from "../utils/timestamp";

export default class CandleChartStore {
  @observable public currencyPair?: CurrencyPair;
  @observable public chartType: ChartType = ChartType.yearly;
  @observable public candleSticks: CandleStick[] = [];
  @observable private subscribed: boolean = false;
  private timer: any;

  @action
  public setCurrencyPair(currencyPair: CurrencyPair) {
    this.unsubscribe();
    this.currencyPair = currencyPair;
    this.subscribe();
  }

  @action
  public setChartType(chartType: ChartType) {
    this.unsubscribe();
    this.chartType = chartType;
    this.subscribe();
  }

  private async loadCandleSticks() {
    this.candleSticks = await candleChartRepository.getCandleSticks(this.currencyPair!, this.chartType);
  }

  private candleSticksTimer() {
    if (this.subscribed) {
      this.loadCandleSticks();

      const current = toTimestamp(new Date());
      const base = Math.floor(current / ChartPeriod.minutes5) * ChartPeriod.minutes5
      const next = base + ChartPeriod.minutes5;

      this.timer = setTimeout(() => this.candleSticksTimer(), next - current);
    }
  }

  @action
  public subscribe() {
    this.subscribed = true;
    this.candleSticksTimer();
  }

  @action
  public unsubscribe() {
    this.subscribed = false;
    clearTimeout(this.timer);
  }
}