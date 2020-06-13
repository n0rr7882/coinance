import { Currency } from "./currency-pair";

export class Wallet {
  public readonly id: number;
  public readonly currency: Currency;
  public readonly amount: number;
  public readonly available_amount: number;
  public readonly aggregated_amount_to_start_currency_price: number;
  public readonly start_currency: Currency;
  public readonly created: Date;
  public readonly modified: Date;

  constructor(data: Wallet) {
    this.id = data.id;
    this.currency = new Currency(data.currency);
    this.amount = Number(data.amount);
    this.available_amount = Number(data.available_amount);
    this.aggregated_amount_to_start_currency_price = Number(data.aggregated_amount_to_start_currency_price);
    this.start_currency = new Currency(data.start_currency);
    this.created = new Date(data.created);
    this.modified = new Date(data.modified);
  }
}

export class WalletSummary {
  public readonly start_currency: Currency;
  public readonly start_amount: number;
  public readonly total: number;
  public readonly count: number;
  public readonly profit_amount: number;
  public readonly profit_rate: number;
  public readonly aggregated: Date;

  constructor(data: WalletSummary) {
    this.start_currency = new Currency(data.start_currency);
    this.start_amount = Number(data.start_amount)
    this.total = Number(data.total);
    this.count = Number(data.count);
    this.profit_amount = Number(data.profit_amount)
    this.profit_rate = Number(data.profit_rate);
    this.aggregated = new Date(data.aggregated);
  }
}
