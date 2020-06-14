import axios from "axios";
import { POLONIEX_API_ENTRY_POINT } from "../constants";
import { CurrencyPair } from "../models/currency-pair";
import { OrderBook, OrderBookOption } from "../models/order-book";

const getOrderBookOpton = (currencyPair: CurrencyPair) => {
  const orderBookOption = new OrderBookOption(20);
  orderBookOption.currencyPair = `${currencyPair.currency_from.symbol}_${currencyPair.currency_to.symbol}`;

  return orderBookOption;
};

class OrderBookRepository {
  private api = axios.create({ baseURL: POLONIEX_API_ENTRY_POINT });

  public async getOrderBook(currencyPair: CurrencyPair) {
    const orderBookOption = getOrderBookOpton(currencyPair);
    const res = await this.api.get<OrderBook>("", { params: orderBookOption });

    return res.data;
  }
}

export const orderBookRepository = new OrderBookRepository();
