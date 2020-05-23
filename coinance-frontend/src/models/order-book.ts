
export class OrderBookOption {
  public command = 'returnOrderBook';
  public currencyPair?: string;
  public depth: number

  constructor(depth: number) {
    this.depth = depth;
  }
}


export class OrderBook {
  public readonly asks: Array<Array<string | number>>;
  public readonly bids: Array<Array<string | number>>;
  public readonly seq: number;

  constructor(data: OrderBook) {
    this.asks = data.asks;
    this.bids = data.bids;
    this.seq = data.seq;
  }
}