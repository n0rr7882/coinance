import { Currency } from "./currency-pair";

export class Wallet {
  public readonly id: number;
  public readonly currency: Currency;
  public readonly amount: number;
  public readonly available_amount: number;
  public readonly created: Date;
  public readonly modified: Date;

  constructor(data: Wallet) {
    this.id = data.id;
    this.currency = new Currency(data.currency);
    this.amount = Number(data.amount);
    this.available_amount = Number(data.available_amount);
    this.created = new Date(data.created);
    this.modified = new Date(data.modified);
  }
}