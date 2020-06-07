import { observable, action } from "mobx";
import { CurrencyPair } from "../models/currency-pair";
import { toMsTimestamp } from "../utils/timestamp";
import { boundClass } from "autobind-decorator";
import { TradeHistory } from "../models/trade-history";
import { tradeHistoryRepository } from "../repositories/trade-history";

@boundClass
export default class TradeHistoryStore {
  private FETCH_INTERVAL_MS = 500;

  @observable public tradeHistories: TradeHistory[] = [];
  @observable private subscribed: boolean = false;
  private timer: any;

  @action
  private async loadTradeHistories(currencyPair: CurrencyPair) {
    try {
      this.tradeHistories = await tradeHistoryRepository.getTradeHistories(currencyPair);
    } catch (e) {
      console.error(e);
    }
  }

  private tardeHistoriesTimer(currencyPair: CurrencyPair) {
    if (this.subscribed) {
      this.loadTradeHistories(currencyPair);

      const current = toMsTimestamp(new Date());
      const base = Math.floor(current / this.FETCH_INTERVAL_MS) * this.FETCH_INTERVAL_MS
      const next = base + this.FETCH_INTERVAL_MS;

      this.timer = setTimeout(() => this.tardeHistoriesTimer(currencyPair), (next - current));
    }
  }

  private setDefaultState() {
    this.tradeHistories = [];
  }

  @action
  public subscribe(currencyPair: CurrencyPair) {
    this.setDefaultState();
    this.subscribed = true;
    this.tardeHistoriesTimer(currencyPair);
  }

  @action
  public unsubscribe() {
    this.subscribed = false;
    clearTimeout(this.timer);
    this.setDefaultState();
  }
}