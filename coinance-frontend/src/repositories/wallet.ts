import axios from "axios";
import ReconnectingWebSocket from "reconnecting-websocket";
import { AuthenticatedRepository } from "./common";
import {
  COINANCE_API_ENTRY_POINT,
  COINANCE_WS_ENTRY_POINT,
} from "../constants";
import { ICommonParams } from "../models/common";
import { Wallet, WalletSummary } from "../models/wallet";
import { getAuthToken } from "../utils/token";
import { User } from "../models/user";

const WALLET_API_ENTRY_POINT = `${COINANCE_API_ENTRY_POINT}/trading/wallets`;
const WALLET_WS_ENTRY_POINT = `${COINANCE_WS_ENTRY_POINT}/wallets/`;

class WalletRepository extends AuthenticatedRepository {
  protected api = axios.create({ baseURL: WALLET_API_ENTRY_POINT });
  protected ws = new ReconnectingWebSocket(WALLET_WS_ENTRY_POINT);

  public constructor() {
    super();
    this.initializeApiAuthInterceptor();
  }

  public async list(params: ICommonParams) {
    const res = await this.api.get<Wallet[]>("/", { params });

    return res.data.map((w) => new Wallet(w));
  }

  public async summary() {
    const res = await this.api.get<WalletSummary>("/summary/");

    return new WalletSummary(res.data);
  }

  public subscribeWS() {
    const payload = JSON.stringify({
      type: "subscription",
      access: getAuthToken().access,
    });
    this.sendWS(payload);
  }

  public unsubscribeWS(user: User) {
    const payload = JSON.stringify({
      type: "unsubscription",
      user_id: user.id,
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

  public addHandlerWS(handler: (wallet: Wallet) => void) {
    this.ws.onmessage = (event) => {
      const raw: { type: string; data: Wallet } = JSON.parse(
        event.data.toString()
      );

      if (["wallet_updated"].includes(raw.type)) {
        const wallet = new Wallet(raw.data);
        handler(wallet);
      }
    };
  }
}

export const walletRepository = new WalletRepository();
