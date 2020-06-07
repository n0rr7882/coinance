import { OrderType } from "./order";

export class TradeHistoryOption {
  public command = 'returnTradeHistory';
  public currencyPair?: string;
}

export class TradeHistory {
  public readonly globalTradeID: number;
  public readonly tradeID: number;
  public readonly date: Date;
  public readonly type: OrderType;
  public readonly rate: number;
  public readonly amount: number;
  public readonly total: number;

  constructor(data: TradeHistory) {
    this.globalTradeID = Number(data.globalTradeID);
    this.tradeID = Number(data.tradeID);
    this.date = new Date(data.date);
    this.type = data.type;
    this.rate = Number(data.rate);
    this.amount = Number(data.amount);
    this.total = Number(data.total);
  }
}
