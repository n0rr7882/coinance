import { toTimestamp } from "./utils/timestamp";

export const FIRST_BITCOIN_ISSUED_TIMESTAMP = toTimestamp(new Date(2009, 0, 3));

export const COINANCE_API_ENTRY_POINT =
  process.env.REACT_APP_COINANCE_API_ENTRY_POINT;
export const COINANCE_WS_ENTRY_POINT =
  process.env.REACT_APP_COINANCE_WS_ENTRY_POINT;
export const POLONIEX_API_ENTRY_POINT =
  process.env.REACT_APP_POLONIEX_API_ENTRY_POINT;
export const GOOGLE_OAUTH2_CLIENT_ID =
  process.env.REACT_APP_GOOGLE_OAUTH2_CLIENT_ID;
export const GOOGLE_OAUTH2_REDIRECT_URI =
  process.env.REACT_APP_GOOGLE_OAUTH2_REDIRECT_URI;
