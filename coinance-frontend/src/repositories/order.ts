import axios from 'axios';
import { COINANCE_API_ENTRY_POINT, COINANCE_WS_ENTRY_POINT } from '../constants';
import { ICommonParams } from '../models/common';
import { Order } from '../models/order';
import { getAuthToken } from '../utils/token';
import { User } from '../models/user';

const ORDER_API_ENTRY_POINT = `${COINANCE_API_ENTRY_POINT}/trading/orders`;
const ORDER_WS_ENTRY_POINT = `${COINANCE_WS_ENTRY_POINT}/orders`;

class OrderRepository {
  private api = axios.create({ baseURL: ORDER_API_ENTRY_POINT });
  private ws = new WebSocket(ORDER_WS_ENTRY_POINT);

  public async list(params: ICommonParams) {
    const res = await this.api.get<Order[]>('/', { params });

    return res.data.map(o => new Order(o));
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

      if (raw.type === 'order_processed') {
        const order = new Order(raw.data);
        handler(order);
      }
    }
  }
}

export const orderRepository = new OrderRepository();
