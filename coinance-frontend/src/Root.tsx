import React from "react";
import { Provider } from "mobx-react";
import { RouterStore, syncHistoryWithStore } from "mobx-react-router";
import { createBrowserHistory } from "history";
import { SnackbarProvider } from "notistack";
import { ThemeProvider, createMuiTheme, CssBaseline } from "@material-ui/core";
import App from "./components/App";
import CurrencyPairStore from "./stores/currency-pair";
import CandleChartStore from "./stores/candle-chart";
import LayoutStore from "./stores/layout";
import AuthStore from "./stores/auth";
import { Router } from "react-router";
import UserSettingStore from "./stores/user-setting";
import { getPaletteType } from "./utils/theme";
import OrderStore from "./stores/order";
import WalletStore from "./stores/wallet";
import OrderBookStore from "./stores/order-book";
import TradeHistoryStore from "./stores/trade-history";

const browserHistory = createBrowserHistory();
const routerStore = new RouterStore();

const stores = {
  routerStore: routerStore,
  layoutStore: new LayoutStore(),
  authStore: new AuthStore(),
  userSettingStore: new UserSettingStore(),
  currencyPairStore: new CurrencyPairStore(),
  candleChartStore: new CandleChartStore(),
  orderStore: new OrderStore(),
  walletStore: new WalletStore(),
  orderBookStore: new OrderBookStore(),
  tradeHistoryStore: new TradeHistoryStore(),
};

const theme = createMuiTheme({
  palette: {
    type: getPaletteType(),
    primary: {
      light: "#51b7ae",
      main: "#26a69a",
      dark: "#1a746b",
      contrastText: "#ffffff",
    },
    secondary: {
      light: "#ff7474",
      main: "#ff5252",
      dark: "#b23939",
      contrastText: "#ffffff",
    },
  },
  shape: {
    borderRadius: 12,
  },
});

const history = syncHistoryWithStore(browserHistory, routerStore);

function Root() {
  return (
    <Provider {...stores}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Router history={history}>
            <CssBaseline />
            <App />
          </Router>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default Root;
