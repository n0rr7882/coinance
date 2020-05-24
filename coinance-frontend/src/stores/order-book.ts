import { observable, action } from "mobx";
import { CurrencyPair } from "../models/currency-pair";
import { toMsTimestamp } from "../utils/timestamp";
import { boundClass } from "autobind-decorator";
import { OrderBook } from "../models/order-book";
import { orderBookRepository } from "../repositories/order-book";

@boundClass
export default class OrderBookStore {
  private FETCH_INTERVAL_MS = 250;

  @observable public orderBook?: OrderBook;
  @observable private subscribed: boolean = false;
  private timer: any;

  @action
  private async loadOrderBook(currencyPair: CurrencyPair) {
    try {
      this.orderBook = await orderBookRepository.getOrderBook(currencyPair);
    } catch (e) {
      console.error(e);
    }
  }

  private orderBookTimer(currencyPair: CurrencyPair) {
    if (this.subscribed) {
      this.loadOrderBook(currencyPair);

      const current = toMsTimestamp(new Date());
      const base = Math.floor(current / this.FETCH_INTERVAL_MS) * this.FETCH_INTERVAL_MS
      const next = base + this.FETCH_INTERVAL_MS;

      this.timer = setTimeout(() => this.orderBookTimer(currencyPair), (next - current));
    }
  }

  private setDefaultState() {
    this.orderBook = undefined;
  }

  @action
  public subscribe(currencyPair: CurrencyPair) {
    this.setDefaultState();
    this.subscribed = true;
    this.orderBookTimer(currencyPair);
  }

  @action
  public unsubscribe() {
    this.subscribed = false;
    clearTimeout(this.timer);
    this.setDefaultState();
  }
}