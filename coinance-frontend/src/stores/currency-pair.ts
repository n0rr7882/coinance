import { observable, action } from "mobx";
import { CurrencyPair } from "../models/currency-pair";
import { currencyPairRepository } from "../repositories/currency-pair";
import { Status, IErrorData } from "../models/common";
import { AxiosError } from "axios";

export default class CurrencyPairStore {
  @observable public status: Status = Status.done;
  @observable public errors?: AxiosError<IErrorData>;
  @observable public currencyPairs: CurrencyPair[] = [];
  @observable public currencyPair?: CurrencyPair;

  constructor() {
    this.updateCurrencyPair = this.updateCurrencyPair.bind(this);
    currencyPairRepository.addHandlerWS(this.updateCurrencyPair);
  }

  public async fetchOne(id: number) {
    this.status = Status.pending;

    try {
      this.currencyPair = await currencyPairRepository.get(id);
      this.status = Status.done;
      this.errors = undefined;
    } catch (e) {
      this.currencyPair = undefined;
      this.status = Status.error;
      this.errors = e;
    }
  }

  @action
  public async updateCurrencyPair(currencyPair: CurrencyPair) {
    // first, update single observable currencyPair
    if (currencyPair.id === this.currencyPair?.id) {
      this.currencyPair = currencyPair;
    }

    const index = this.currencyPairs.findIndex(c => c.id === currencyPair.id);
    if (index === -1) return;

    this.currencyPairs[index] = currencyPair;
  }

  @action
  public async fetchAll() {
    this.status = Status.pending;

    try {
      this.currencyPairs = await currencyPairRepository.list({});
      this.status = Status.done;
      this.errors = undefined;
    } catch (e) {
      this.status = Status.error;
      this.errors = e;
    }
  }

  @action
  public subscribe(currencyPair: CurrencyPair) {
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