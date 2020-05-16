import { observable, action } from "mobx";
import { CurrencyPair } from "../models/currency-pair";
import { ChartType, CandleStick } from "../models/candle-chart";
import { candleChartRepository } from "../repositories/candle-chart";
import { toTimestamp } from "../utils/timestamp";
import { boundClass } from "autobind-decorator";

@boundClass
export default class CandleChartStore {
  private FETCH_INTERVAL = 5;

  @observable public chartType: ChartType = ChartType.daily;
  @observable public candleSticks: CandleStick[] = [];
  @observable private subscribed: boolean = false;
  private timer: any;

  @action
  private async loadCandleSticks(currencyPair: CurrencyPair) {
    try {
      if (this.candleSticks.length === 0) {
        await this.initializeCandleSticks(currencyPair);
      } else {
        await this.updateCandleSticks(currencyPair);
      }
    } catch (e) {
      console.error(e);
    }
  }

  private async initializeCandleSticks(currencyPair: CurrencyPair) {
    this.candleSticks = await candleChartRepository.getCandleSticks(currencyPair, this.chartType);
  }

  private async updateCandleSticks(currencyPair: CurrencyPair) {
    const lastNewCandleStick = await candleChartRepository.getLastCandleStick(currencyPair, this.chartType);
    const lastCandleStick = this.candleSticks[this.candleSticks.length - 1];

    if (toTimestamp(lastCandleStick.date) === toTimestamp(lastNewCandleStick.date)) {
      this.candleSticks[this.candleSticks.length - 1] = lastNewCandleStick;
    } else {
      this.candleSticks.push(lastNewCandleStick);
    }
  }

  private candleSticksTimer(currencyPair: CurrencyPair) {
    if (this.subscribed) {
      this.loadCandleSticks(currencyPair);

      const current = toTimestamp(new Date());
      const base = Math.floor(current / this.FETCH_INTERVAL) * this.FETCH_INTERVAL
      const next = base + this.FETCH_INTERVAL;

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