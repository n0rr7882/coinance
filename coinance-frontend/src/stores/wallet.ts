import { boundClass } from "autobind-decorator";
import { observable, action } from "mobx";
import { Status, IErrorData } from "../models/common";
import { AxiosError } from "axios";
import { Wallet } from "../models/wallet";
import { walletRepository } from "../repositories/wallet";
import { User } from "../models/user";

@boundClass
export default class WalletStore {
  @observable public status: Status = Status.done;
  @observable public errors?: AxiosError<IErrorData>;
  @observable public wallets: Wallet[] = [];

  constructor() {
    walletRepository.addHandlerWS(this.updateWallet);
  }

  @action
  public async updateWallet(wallet: Wallet) {
    const index = this.wallets.findIndex((w) => w.id === wallet.id);
    if (index === -1) {
      this.wallets.push(wallet);
    } else {
      this.wallets[index] = wallet;
    }
  }

  @action
  public async fetchAll() {
    this.status = Status.pending;

    try {
      this.wallets = await walletRepository.list({});
      this.errors = undefined;
      this.status = Status.done;
    } catch (e) {
      this.errors = e;
      this.status = Status.error;
    }
  }

  @action
  public async subscribe() {
    this.fetchAll();
    walletRepository.subscribeWS();
  }

  @action
  public async unsubscribe(user: User) {
    walletRepository.unsubscribeWS(user);
    this.wallets = [];
  }
}
