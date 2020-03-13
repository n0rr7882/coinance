import React from 'react';
import { inject, observer } from 'mobx-react';
import CurrencyPairStore from '../../stores/currency-pair';
import CandleChartStore from '../../stores/candle-chart';
import TradingChart from '../../components/TradingChart';

interface IProps {
  candleChartStore?: CandleChartStore;
  currencyPairStore?: CurrencyPairStore;
}

@inject('candleChartStore', 'currencyPairStore')
@observer
export default class TradingChartContainer extends React.Component<IProps> {
  async componentDidMount() {
    const candleChartStore = this.props.candleChartStore!;
    const currencyPairStore = this.props.currencyPairStore!;

    await currencyPairStore.fetchAll();
    candleChartStore.setCurrencyPair(currencyPairStore.currencyPairs.find(c => c.currency_to.symbol === 'ETH')!);
  }

  componentWillUnmount() {
    const candleChartStore = this.props.candleChartStore!;
    candleChartStore.unsubscribe();
  }

  render() {
    const candleChartStore = this.props.candleChartStore!;
    return candleChartStore.candleSticks.length !== 0 ? <TradingChart
      data={candleChartStore.candleSticks}
    /> : <div>로딩중</div>
  }
}