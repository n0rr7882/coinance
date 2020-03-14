import { observable, action } from "mobx";
import { CurrencyPair } from "../models/currency-pair";
import { currencyPairRepository } from "../repositories/currency-pair";

export default class CurrencyPairStore {
  @observable public currencyPairs: CurrencyPair[] = [];

  constructor() {
    this.updateCurrencyPair = this.updateCurrencyPair.bind(this);
    currencyPairRepository.addHandlerWS(this.updateCurrencyPair);
  }

  @action
  public async updateCurrencyPair(currencyPair: CurrencyPair) {
    const index = this.currencyPairs.findIndex(c => c.id === currencyPair.id);
    if (index === -1) return;

    this.currencyPairs[index] = currencyPair;
  }

  @action
  public async fetchAll() {
    this.currencyPairs = await currencyPairRepository.list({});
  }

  @action
  public async subscribe(currencyPair: CurrencyPair) {
    currencyPairRepository.subscribeWS(currencyPair);
  }

  @action
  public subscribeAll() {
    this.currencyPairs.forEach(currencyPair => {
      currencyPairRepository.subscribeWS(currencyPair);
    });
  }

  @action
  public unsubscribe(currencyPair: CurrencyPair) {
    currencyPairRepository.unsubscribeWS(currencyPair);
  }

  @action
  public unsubscribeAll() {
    this.currencyPairs.forEach(currencyPair => {
      currencyPairRepository.unsubscribeWS(currencyPair);
    });
  }

}