import React from 'react';
import { Provider } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { createBrowserHistory } from 'history';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';
import App from './components/App';
import CurrencyPairStore from './stores/currency-pair';
import CandleChartStore from './stores/candle-chart';
import LayoutStore from './stores/layout';
import AuthStore from './stores/auth';
import { Router } from 'react-router';

const browserHistory = createBrowserHistory();
const routerStore = new RouterStore();

const stores = {
  routerStore: routerStore,
  layoutStore: new LayoutStore(),
  authStore: new AuthStore(),
  currencyPairStore: new CurrencyPairStore(),
  candleChartStore: new CandleChartStore(),
}

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#7a7cff',
      main: '#304ffe',
      dark: '#0026ca',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#ff616f',
      main: '#ff1744',
      dark: '#c4001d',
      contrastText: '#000000',
    },
  },
});

const history = syncHistoryWithStore(browserHistory, routerStore);

function Root() {
  return (
    <Provider {...stores}>
      <ThemeProvider theme={theme}>
        <Router history={history}>
          <App />
          <ToastContainer transition={Slide} />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default Root;
