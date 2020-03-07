import { observable, action } from "mobx";
import { CurrencyPair } from "../models/currency-pair";
import { currencyPairRepository } from "../repositories/currency-pair";

export class CurrencyPairStore {
  @observable public currencyPairs: CurrencyPair[] = [];

  constructor() {
    this.updateCurrencyPair = this.updateCurrencyPair.bind(this);
    currencyPairRepository.addHandlerWS(this.updateCurrencyPair);
    this.fetchAll().then(() => { this.subscribeAll() });
  }

  @action
  public async updateCurrencyPair(currencyPair: CurrencyPair) {
    console.log('Updated:', currencyPair);
    const index = this.currencyPairs.findIndex(c => c.id === currencyPair.id);
    if (index === -1) return;

    this.currencyPairs[index] = currencyPair;
  }

  @action
  public async fetchAll() {
    this.currencyPairs = await currencyPairRepository.list({});
  }

  @action
  public subscribeAll() {
    this.currencyPairs.forEach(currencyPair => {
      currencyPairRepository.subscribeWS(currencyPair);
    });
  }

  @action
  public unsubscribeAll() {
    this.currencyPairs.forEach(currencyPair => {
      currencyPairRepository.unsubscribeWS(currencyPair);
    });
  }

}