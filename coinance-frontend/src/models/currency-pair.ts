import { observable } from "mobx";

export class Currency {
  public readonly id: number;
  public readonly poloniex_id: number;
  public readonly symbol: string;
  public readonly name: string;
  public readonly maximum_amount_for_start?: number;

  constructor(data: Currency) {
    this.id = data.id;
    this.poloniex_id = data.poloniex_id;
    this.symbol = data.symbol;
    this.name = data.name;
    this.maximum_amount_for_start = data.maximum_amount_for_start;
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
    this.last_trade_price = Number(data.last_trade_price);
    this.lowest_ask = Number(data.lowest_ask);
    this.highest_bid = Number(data.highest_bid);
    this.change_rate_24h = data.change_rate_24h;
    this.base_volume_24h = Number(data.base_volume_24h);
    this.quote_volume_24h = Number(data.quote_volume_24h);
    this.market_active = data.market_active;
    this.highest_trade_price_24h = Number(data.highest_trade_price_24h);
    this.lowest_trade_price_24h = Number(data.lowest_trade_price_24h);
  }
}

export class CurrencyPair {
  public readonly id: number;
  public readonly poloniex_id: number;
  public readonly currency_from: Currency;
  public readonly currency_to: Currency;
  public readonly commission_rate: number;
  @observable public exchange_rate: ExchangeRate;

  constructor(data: CurrencyPair) {
    this.id = data.id;
    this.poloniex_id = data.poloniex_id;
    this.currency_from = new Currency(data.currency_from);
    this.currency_to = new Currency(data.currency_to);
    this.commission_rate = Number(data.commission_rate);
    this.exchange_rate = new ExchangeRate(data.exchange_rate);
  }
}
