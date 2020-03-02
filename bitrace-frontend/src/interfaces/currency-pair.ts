export interface ICurrency {
  id: number;
  poloniex_id: number;
  symbol: string;
  name: string;
}

export interface IExchangeRate {
  id: number;
  currency_pair: number;
  last_trade_price: number;
  lowest_ask: number;
  highest_bid: number;
  change_rate_24h: number;
  base_volume_24h: number;
  quote_volume_24h: number;
  market_active: boolean;
  highest_trade_price_24h: number;
  lowest_trade_price_24h: number;
}

export interface ICurrencyPair {
  id: number;
  poloniex_id: number;
  currency_from: ICurrency;
  currency_to: ICurrency;
  exchange_rate: IExchangeRate;
}
