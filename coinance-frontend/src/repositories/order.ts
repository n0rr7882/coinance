import axios from 'axios';
import { COINANCE_API_ENTRY_POINT, COINANCE_WS_ENTRY_POINT } from '../constants';
import { ICommonParams } from '../models/common';
import { Order, OrderForm } from '../models/order';
import { getAuthToken } from '../utils/token';
import { User } from '../models/user';

const ORDER_API_ENTRY_POINT = `${COINANCE_API_ENTRY_POINT}/trading/orders`;
const ORDER_WS_ENTRY_POINT = `${COINANCE_WS_ENTRY_POINT}/orders/`;

class OrderRepository {
  private api = axios.create({ baseURL: ORDER_API_ENTRY_POINT });
  private ws = new WebSocket(ORDER_WS_ENTRY_POINT);

  public async list(params: ICommonParams) {
    const headers = { Authorization: `Bearer ${getAuthToken().access}` };
    const res = await this.api.get<Order[]>('/', { params, headers });

    return res.data.map(o => new Order(o));
  }

  public async create(order: OrderForm) {
    const headers = { Authorization: `Bearer ${getAuthToken().access}` };
    const res = await this.api.post<Order>('/', order, { headers });

    return new Order(res.data);
  }

  public async cancel(order: Order) {
    const headers = { Authorization: `Bearer ${getAuthToken().access}` };
    await this.api.delete(`/${order.id}`, { headers });
  }

  public subscribeWS() {
    const payload = JSON.stringify({
      type: 'subscription',
      access: getAuthToken().access,
    });
    this.ws.send(payload);
  }

  public unsubscribeWS(user: User) {
    const payload = JSON.stringify({
      type: 'unsubscription',
      user_id: user.id,
    });
    this.ws.send(payload);
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
