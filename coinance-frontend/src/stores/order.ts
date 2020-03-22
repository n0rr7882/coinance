import { observable, action } from "mobx";
import { Status, IErrorData } from "../models/common";
import { AxiosError } from "axios";
import { Order, OrderType, OrderForm } from "../models/order";
import { orderRepository } from "../repositories/order";
import { User } from "../models/user";
import { boundClass } from "autobind-decorator";
import { CurrencyPair } from "../models/currency-pair";


const initializeOrderForm = (orderType: OrderType): OrderForm => ({
  order_type: orderType,
  price: 0,
  amount: 0,
});

export interface OrderControl {
  status: Status;
  errors?: AxiosError<IErrorData>;
  form: OrderForm;
}

@boundClass
export default class OrderStore {
  @observable public status: Status = Status.done;
  @observable public errors?: AxiosError<IErrorData>;
  @observable public orders: Order[] = [];

  @observable public buy: OrderControl = {
    status: Status.done,
    errors: undefined,
    form: { order_type: OrderType.buy, price: 0, amount: 0 },
  };
  @observable public sell: OrderControl = {
    status: Status.done,
    errors: undefined,
    form: { order_type: OrderType.sell, price: 0, amount: 0 },
  };

  constructor() {
    this.updateOrder = this.updateOrder.bind(this);
    orderRepository.addHandlerWS(this.updateOrder);
  }

  @action
  public async updateOrder(order: Order) {
    const index = this.orders.findIndex(o => o.id === order.id);
    if (index === -1) {
      this.orders.push(order);
    } else {
      this.orders[index] = order;
    }
  }

  @action
  public initializeBuyForm(currencyPair: CurrencyPair) {
    this.buy.form = initializeOrderForm(OrderType.buy);
  }

  @action
  public initializeSellForm(currencyPair: CurrencyPair) {
    this.sell.form = initializeOrderForm(OrderType.sell);
  }

  @action
  public async createBuy(): Promise<boolean> {
    return await this.create(this.buy);
  }

  @action
  public async createSell(): Promise<boolean> {
    return await this.create(this.sell);
  }

  @action
  public async create(control: OrderControl): Promise<boolean> {
    control.status = Status.pending;

    try {
      await orderRepository.create(control.form!);
      control.status = Status.done;
      control.errors = undefined;

      return true;
    } catch (e) {
      control.status = Status.error;
      control.errors = e;

      return false;
    }
  }

  @action
  public async cancel(order: Order): Promise<boolean> {
    this.status = Status.pending;

    try {
      await orderRepository.cancel(order);
      this.status = Status.done;
      this.errors = undefined;

      return true;
    } catch (e) {
      this.status = Status.error;
      this.errors = e;

      return false;
    }
  }

  @action
  public async fetchAll() {
    this.status = Status.pending;

    try {
      this.orders = await orderRepository.list({});
      this.status = Status.done;
      this.errors = undefined;
    } catch (e) {
      this.status = Status.error;
      this.errors = e;
    }
  }

  @action
  public subscribe() {
    this.fetchAll();
    orderRepository.subscribeWS();
  }

  @action
  public unsubscribe(user: User) {
    orderRepository.unsubscribeWS(user);
    this.orders = [];
  }
}