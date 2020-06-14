import React from "react";
import { inject, observer } from "mobx-react";
import { RouterStore } from "mobx-react-router";
import CurrencyPairStore from "../../stores/currency-pair";
import CandleChartStore from "../../stores/candle-chart";
import TradingChart from "../../components/TradingChart";
import { ChartType } from "../../models/candle-chart";

interface IProps {
  routerStore?: RouterStore;
  candleChartStore?: CandleChartStore;
  currencyPairStore?: CurrencyPairStore;
}

@inject("routerStore", "candleChartStore", "currencyPairStore")
@observer
export default class TradingChartContainer extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.setChartType = this.setChartType.bind(this);
  }

  private setChartType(chartType: ChartType) {
    const currencyPairStore = this.props.currencyPairStore!;
    const candleChartStore = this.props.candleChartStore!;

    if (currencyPairStore.currencyPair) {
      candleChartStore.unsubscribe();
      candleChartStore.subscribe(currencyPairStore.currencyPair, chartType);
    }
  }

  async componentDidMount() {
    const routerStore = this.props.routerStore!;
    const currencyPairStore = this.props.currencyPairStore!;
    const candleChartStore = this.props.candleChartStore!;

    const currencyPairId = Number(
      routerStore.location.pathname
        .split("/")
        .filter((i) => i !== "")
        .pop()
    );

    await currencyPairStore.fetchOne(currencyPairId);

    if (currencyPairStore.currencyPair) {
      currencyPairStore.subscribe(currencyPairStore.currencyPair);
      candleChartStore.subscribe(
        currencyPairStore.currencyPair,
        ChartType.daily
      );
    }
  }

  componentWillUnmount() {
    const currencyPairStore = this.props.currencyPairStore!;
    const candleChartStore = this.props.candleChartStore!;

    currencyPairStore.unsubscribeAll();
    candleChartStore.unsubscribe();
  }

  render() {
    const currencyPairStore = this.props.currencyPairStore!;
    const candleChartStore = this.props.candleChartStore!;
    return (
      <TradingChart
        status={currencyPairStore.status}
        errors={currencyPairStore.errors}
        chartType={candleChartStore.chartType}
        chartData={candleChartStore.candleSticks}
        currencyPair={currencyPairStore.currencyPair}
        setChartType={this.setChartType}
      />
    );
  }
}
