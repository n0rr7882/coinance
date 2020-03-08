import React from 'react';
import { Provider } from 'mobx-react';
import App from './components/App';
import CurrencyPairStore from './stores/currency-pair';
import CandleChartStore from './stores/candle-chart';
import LayoutStore from './stores/layout';
import AuthStore from './stores/auth';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';

const stores = {
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

function Root() {
  return (
    <Provider {...stores}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  );
}

export default Root;
