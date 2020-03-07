export class Currency {
  public readonly id: number;
  public readonly poloniex_id: number;
  public readonly symbol: string;
  public readonly name: string;

  constructor(data: Currency) {
    this.id = data.id;
    this.poloniex_id = data.poloniex_id;
    this.symbol = data.symbol;
    this.name = data.name;
  }
}

export class ExchangeRate {
  public readonly id: number;
  public readonly currency_pair: number;
  public readonly last_trade_price: number;
  public readonly lowest_ask: number;
  public readonly highest_bid: number;
  public readonly change_rate_24h: number;
  public readonly base_volume_24h: number;
  public readonly quote_volume_24h: number;
  public readonly market_active: boolean;
  public readonly highest_trade_price_24h: number;
  public readonly lowest_trade_price_24h: number;

  constructor(data: ExchangeRate) {
    this.id = data.id;
    this.currency_pair = data.currency_pair;
    this.last_trade_price = data.last_trade_price;
    this.lowest_ask = data.lowest_ask;
    this.highest_bid = data.highest_bid;
    this.change_rate_24h = data.change_rate_24h;
    this.base_volume_24h = data.base_volume_24h;
    this.quote_volume_24h = data.quote_volume_24h;
    this.market_active = data.market_active;
    this.highest_trade_price_24h = data.highest_trade_price_24h;
    this.lowest_trade_price_24h = data.lowest_trade_price_24h;
  }
}

export class CurrencyPair {
  public readonly id: number;
  public readonly poloniex_id: number;
  public readonly currency_from: Currency;
  public readonly currency_to: Currency;
  public readonly exchange_rate: ExchangeRate;

  constructor(data: CurrencyPair) {
    this.id = data.id;
    this.poloniex_id = data.poloniex_id;
    this.currency_from = data.currency_from;
    this.currency_to = data.currency_to;
    this.exchange_rate = data.exchange_rate;
  }
}
