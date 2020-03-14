import React from 'react';
import { inject, observer } from 'mobx-react';
import { RouterStore } from 'mobx-react-router';
import CurrencyPairStore from '../../stores/currency-pair';
import CandleChartStore from '../../stores/candle-chart';
import TradingChart from '../../components/TradingChart';
import { ChartType } from '../../models/candle-chart';
import { CurrencyPair } from '../../models/currency-pair';

interface IProps {
  routerStore?: RouterStore;
  candleChartStore?: CandleChartStore;
  currencyPairStore?: CurrencyPairStore;
}

@inject('routerStore', 'candleChartStore', 'currencyPairStore')
@observer
export default class TradingChartContainer extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.setChartType = this.setChartType.bind(this);
  }

  private get currencyPair(): CurrencyPair {
    const routerStore = this.props.routerStore!;
    const currencyPairStore = this.props.currencyPairStore!;

    const currencyPairId = Number(routerStore.location.pathname.split('/').filter(i => i !== '').pop());
    return currencyPairStore.currencyPairs.find(c => c.id === currencyPairId)!;
  }

  private setChartType(chartType: ChartType) {
    const candleChartStore = this.props.candleChartStore!;

    candleChartStore.unsubscribe();
    candleChartStore.subscribe(this.currencyPair, chartType);
  }

  async componentDidMount() {
    const currencyPairStore = this.props.currencyPairStore!;
    const candleChartStore = this.props.candleChartStore!;

    await currencyPairStore.fetchAll();

    const currencyPair = this.currencyPair;
    currencyPairStore.subscribe(currencyPair);
    candleChartStore.subscribe(currencyPair, ChartType.daily);
  }

  componentWillUnmount() {
    const currencyPairStore = this.props.currencyPairStore!;
    const candleChartStore = this.props.candleChartStore!;

    currencyPairStore.unsubscribeAll();
    candleChartStore.unsubscribe();
  }

  render() {
    const candleChartStore = this.props.candleChartStore!;
    return (
      <TradingChart
        chartType={candleChartStore.chartType}
        chartData={candleChartStore.candleSticks}
        currencyPair={this.currencyPair}
        setChartType={this.setChartType}
      />
    );
  }
}