import axios from "axios";
import { POLONIEX_API_ENTRY_POINT } from "../constants";
import { CurrencyPair } from "../models/currency-pair";
import { TradeHistory, TradeHistoryOption } from "../models/trade-history";

const getTradeHistoryOption = (currencyPair: CurrencyPair) => {
  const tradeHistoryOption = new TradeHistoryOption();
  tradeHistoryOption.currencyPair = `${currencyPair.currency_from.symbol}_${currencyPair.currency_to.symbol}`;

  return tradeHistoryOption;
};

class TradeHistoryRepository {
  private api = axios.create({ baseURL: POLONIEX_API_ENTRY_POINT });

  public async getTradeHistories(currencyPair: CurrencyPair) {
    const tradeHistoryOption = getTradeHistoryOption(currencyPair);
    const res = await this.api.get<TradeHistory[]>("", {
      params: tradeHistoryOption,
    });

    return res.data.map((t) => new TradeHistory(t));
  }
}

export const tradeHistoryRepository = new TradeHistoryRepository();
