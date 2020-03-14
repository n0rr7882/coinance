import { toTimestamp } from "./utils/timestamp";

export const COINANCE_API_ENTRY_POINT = `http://localhost:8080`;
export const COINANCE_WS_ENTRY_POINT = `ws://localhost:8000/ws`;
export const POLONIEX_API_ENTRY_POINT = `https://poloniex.com/public`;
export const FIRST_BITCOIN_ISSUED_TIMESTAMP = toTimestamp(new Date(2009, 0, 3));
export const GOOGLE_OAUTH2_CLIENT_ID = `665748257783-52fi7mro0saugt567itbqlthsk15dani.apps.googleusercontent.com`;
export const GOOGLE_OAUTH2_REDIRECT_URI = `http://localhost:3000`;