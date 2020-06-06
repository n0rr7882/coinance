import { observable } from "mobx";
import { CurrencyPair } from "./currency-pair";

export enum OrderType {
  buy = 'buy',
  sell = 'sell',
}

export enum OrderStatus {
  ordered = 'ordered',
  tarded = 'traded',
  cancelled = 'cancelled',
}

export class Order {
  public readonly id?: number;
  @observable public currency_pair: CurrencyPair;
  @observable public order_type: OrderType;
  @observable public status: OrderStatus;
  @observable public price: number;
  @observable public amount: number;
  public readonly traded?: Date;
  public readonly created?: Date;
  public readonly modified?: Date;

  constructor(data: Order) {
    this.id = data.id;
    this.currency_pair = new CurrencyPair(data.currency_pair);
    this.order_type = data.order_type;
    this.status = data.status;
    this.price = Number(data.price);
    this.amount = Number(data.amount);
    this.traded = data.traded ? new Date(data.traded) : undefined;
    this.created = data.created ? new Date(data.created) : undefined;
    this.modified = data.modified ? new Date(data.modified) : undefined;
  }
}

export interface OrderForm {
  currency_pair?: number;
  order_type: OrderType;
  price: number;
  amount: number;
}
