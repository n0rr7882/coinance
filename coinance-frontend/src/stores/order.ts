import { observable, action } from "mobx";
import { Status, IErrorData } from "../models/common";
import { AxiosError } from "axios";
import { Order } from "../models/order";
import { orderRepository } from "../repositories/order";
import { User } from "../models/user";
import { boundClass } from "autobind-decorator";

@boundClass
export default class OrderStore {
  @observable public status: Status = Status.done;
  @observable public errors?: AxiosError<IErrorData>;
  @observable public orders: Order[] = [];

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
  public async create(order: Order): Promise<boolean> {
    this.status = Status.pending;

    try {
      await orderRepository.create(order);
      this.status = Status.done;
      this.errors = undefined;
      this.fetchAll();

      return true;
    } catch (e) {
      this.status = Status.error;
      this.errors = e;

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
    orderRepository.subscribeWS();
  }

  @action
  public unsubscribe(user: User) {
    orderRepository.unsubscribeWS(user);
  }
}