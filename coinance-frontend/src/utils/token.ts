import { IToken } from "../models/auth";

export function hasAuthToken(): boolean {
  const access = window.localStorage.getItem("access");
  const refresh = window.localStorage.getItem("refresh");

  return access && refresh ? true : false;
}

export function setAuthToken(token: IToken) {
  window.localStorage.setItem("access", token.access);
  window.localStorage.setItem("refresh", token.refresh);
}

export function getAuthToken(): IToken {
  const access = window.localStorage.getItem("access");
  const refresh = window.localStorage.getItem("refresh");

  if (!(access && refresh)) {
    throw new Error("Cannot found stored token in localStorage.");
  }

  return { access, refresh };
}

export function removeAuthToken() {
  window.localStorage.removeItem("access");
  window.localStorage.removeItem("refresh");
}
