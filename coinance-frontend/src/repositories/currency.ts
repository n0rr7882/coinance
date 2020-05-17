import axios from 'axios';
import { COINANCE_API_ENTRY_POINT } from '../constants';
import { ICommonParams } from '../models/common';
import { Currency } from '../models/currency-pair';

const CURRENCY_API_ENTRY_POINT = `${COINANCE_API_ENTRY_POINT}/currency/currencies`;

class CurrencyRepository {
  private api = axios.create({ baseURL: CURRENCY_API_ENTRY_POINT });

  public async list(params: ICommonParams) {
    const res = await this.api.get<Currency[]>('/', { params });

    return res.data.map(c => new Currency(c));
  }

  public async one(id: number) {
    const res = await this.api.get<Currency>(`/${id}/`);

    return new Currency(res.data);
  }
}

export const currencyRepository = new CurrencyRepository();
