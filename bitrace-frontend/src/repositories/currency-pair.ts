import axios from 'axios';
import { BITRACE_API_ENTRY_POINT, BITRACE_WS_ENTRY_POINT } from '../constants';
import { ICommonParams } from '../models/common';
import { CurrencyPair } from '../models/currency-pair';

const CURRENCY_PAIR_API_ENTRY_POINT = `${BITRACE_API_ENTRY_POINT}/currency/currency-pairs`;
const CURRENCY_PAIR_WS_ENTRY_POINT = `${BITRACE_WS_ENTRY_POINT}/currency-pairs/`;

class CurrencyPairRepository {
  private api = axios.create({ baseURL: CURRENCY_PAIR_API_ENTRY_POINT });
  private ws = new WebSocket(CURRENCY_PAIR_WS_ENTRY_POINT);

  public async list(params: ICommonParams) {
    const res = await this.api.get<CurrencyPair[]>('/', { params });

    return res.data;
  }

  public subscribeWS(currencyPair: CurrencyPair) {
    const payload = JSON.stringify({
      type: 'subscription',
      currency_pair_id: currencyPair.id,
    });
    this.ws.send(payload);
  }

  public unsubscribeWS(currencyPair: CurrencyPair) {
    const payload = JSON.stringify({
      type: 'unsubscription',
      currency_pair_id: currencyPair.id,
    });
    this.ws.send(payload);
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
