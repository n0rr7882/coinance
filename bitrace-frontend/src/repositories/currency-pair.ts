import axios from 'axios';
import { BITRACE_API_ENTRY_POINT } from '../constants';
import { ICommonParams } from '../interfaces/common';
import { ICurrencyPair } from '../interfaces/currency-pair';

const CURRENCY_PAIR_API_ENTRY_POINT = `${BITRACE_API_ENTRY_POINT}/currency/currency-pairs`;

class CurrencyPairRepository {
  private api = axios.create({ baseURL: CURRENCY_PAIR_API_ENTRY_POINT })

  public find(params: ICommonParams) {
    return this.api.get<ICurrencyPair[]>('/', { params });
  }
  public findOne(id: number) {
    return this.api.get<ICurrencyPair>(`/${id}/`);
  }
}

export default new CurrencyPairRepository();
