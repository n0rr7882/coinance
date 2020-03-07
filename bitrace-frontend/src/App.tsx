import React from 'react';
import { Provider } from 'mobx-react';
import { CurrencyPairStore } from './stores/currency-pair';
import CandleChartStore from './stores/candle-chart';

const stores = {
  currencyPairStore: new CurrencyPairStore(),
  candleChartStore: new CandleChartStore(),
}

function App() {
  return (
    <Provider {...stores}>
      <div className="App">
        asdf
      </div>
    </Provider>
  );
}

export default App;
