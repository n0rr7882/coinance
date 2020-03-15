import { observable, action } from "mobx";
import { boundClass } from 'autobind-decorator';
import { Status, IErrorData } from "../models/common";
import { AxiosError } from "axios";
import { User } from "../models/user";
import { getAuthToken, setAuthToken, removeAuthToken } from "../utils/token";
import { authRepository } from "../repositories/auth";

@boundClass
export default class AuthStore {
  @observable public status: Status = Status.done;
  @observable public errors?: AxiosError<IErrorData>;
  @observable public me?: User;

  @action
  public async googleOauth2Login(code: string) {
    this.status = Status.pending;

    try {
      setAuthToken(await authRepository.googleOauth2Login(code));
      this.me = await authRepository.me(getAuthToken());

      this.errors = undefined;
      this.status = Status.done;
    } catch (e) {
      this.errors = e;
      this.status = Status.error;
    }
  }

  @action
  public logout() {
    this.status = Status.pending;

    this.me = undefined;
    this.errors = undefined;
    removeAuthToken();

    this.status = Status.done;
  }

  @action
  public async verify() {
    this.status = Status.pending;

    try {
      this.me = await authRepository.me(getAuthToken());

      this.errors = undefined;
      this.status = Status.done;
    } catch (e) {
      this.me = undefined;
      this.errors = e;
      this.status = Status.error;
      removeAuthToken();
    }
  }
}