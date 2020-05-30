import axios from 'axios';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { COINANCE_API_ENTRY_POINT, COINANCE_WS_ENTRY_POINT } from '../constants';
import { ICommonParams } from '../models/common';
import { Order, OrderForm } from '../models/order';
import { getAuthToken } from '../utils/token';
import { User } from '../models/user';
import { AuthenticatedRepository } from './common';

const ORDER_API_ENTRY_POINT = `${COINANCE_API_ENTRY_POINT}/trading/orders`;
const ORDER_WS_ENTRY_POINT = `${COINANCE_WS_ENTRY_POINT}/orders/`;

class OrderRepository extends AuthenticatedRepository {
  protected api = axios.create({ baseURL: ORDER_API_ENTRY_POINT });
  protected ws = new ReconnectingWebSocket(ORDER_WS_ENTRY_POINT);

  public constructor() {
    super();
    this.initializeApiAuthInterceptor();
  }

  public async list(params: ICommonParams) {
    const res = await this.api.get<Order[]>('/', { params });

    return res.data.map(o => new Order(o));
  }

  public async create(order: OrderForm) {
    const res = await this.api.post<Order>('/', order);

    return new Order(res.data);
  }

  public async cancel(order: Order) {
    await this.api.delete(`/${order.id}`);
  }

  public subscribeWS() {
    const payload = JSON.stringify({
      type: 'subscription',
      access: getAuthToken().access,
    });
    this.sendWS(payload);
  }

  public unsubscribeWS(user: User) {
    const payload = JSON.stringify({
      type: 'unsubscription',
      user_id: user.id,
    });
    this.sendWS(payload);
  }

  private sendWS(payload: any) {
    if (this.ws.readyState !== this.ws.OPEN) {
      this.ws.onopen = () => this.ws.send(payload);
    } else {
      this.ws.send(payload);
    }
  }

  public addHandlerWS(handler: (order: Order) => void) {
    this.ws.onmessage = event => {
      const raw: { type: string, data: Order } = JSON.parse(event.data.toString());

      if (['order_created', 'order_processed', 'order_cancelled'].includes(raw.type)) {
        const order = new Order(raw.data);
        handler(order);
      }
    }
  }
}

export const orderRepository = new OrderRepository();
