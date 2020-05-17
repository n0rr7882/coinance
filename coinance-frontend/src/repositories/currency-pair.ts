import axios from 'axios';
import { COINANCE_API_ENTRY_POINT, COINANCE_WS_ENTRY_POINT } from '../constants';
import { ICommonParams } from '../models/common';
import { CurrencyPair } from '../models/currency-pair';

const CURRENCY_PAIR_API_ENTRY_POINT = `${COINANCE_API_ENTRY_POINT}/currency/currency-pairs`;
const CURRENCY_PAIR_WS_ENTRY_POINT = `${COINANCE_WS_ENTRY_POINT}/currency-pairs/`;

class CurrencyPairRepository {
  private api = axios.create({ baseURL: CURRENCY_PAIR_API_ENTRY_POINT });
  private ws = new WebSocket(CURRENCY_PAIR_WS_ENTRY_POINT);

  public async get(id: number) {
    const res = await this.api.get<CurrencyPair>(`/${id}/`);

    return new CurrencyPair(res.data);
  }

  public async list(params: ICommonParams) {
    const res = await this.api.get<CurrencyPair[]>('/', { params });

    return res.data.map(c => new CurrencyPair(c));
  }

  public subscribeWS(currencyPair: CurrencyPair) {
    const payload = JSON.stringify({
      type: 'subscription',
      currency_pair_id: currencyPair.id,
    });
    this.sendWS(payload);
  }

  public unsubscribeWS(currencyPair: CurrencyPair) {
    const payload = JSON.stringify({
      type: 'unsubscription',
      currency_pair_id: currencyPair.id,
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

  public addHandlerWS(handler: (currencyPair: CurrencyPair) => void) {
    this.ws.onmessage = event => {
      const raw: { type: string, data: CurrencyPair } = JSON.parse(event.data.toString());

      if (raw.type === 'update_exchange_rate') {
        const currencyPair = new CurrencyPair(raw.data);
        handler(currencyPair);
      }
    }
  }
}

export const currencyPairRepository = new CurrencyPairRepository();
