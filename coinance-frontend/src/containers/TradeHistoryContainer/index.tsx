import React from "react";
import { inject, observer } from "mobx-react";
import { RouterStore } from "mobx-react-router";
import TradeHistoryStore from "../../stores/trade-history";
import CurrencyPairStore from "../../stores/currency-pair";
import TradeHistory from "../../components/TradeHistory";
import OrderStore from "../../stores/order";

interface Props {
  routerStore?: RouterStore;
  tradeHistoryStore?: TradeHistoryStore;
  currencyPairStore?: CurrencyPairStore;
  orderStore?: OrderStore;
}

@inject("routerStore", "tradeHistoryStore", "currencyPairStore", "orderStore")
@observer
export default class TradeHistoryContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.setOrderPrice = this.setOrderPrice.bind(this);
  }

  async componentDidMount() {
    const routerStore = this.props.routerStore as RouterStore;
    const currencyPairStore = this.props.currencyPairStore as CurrencyPairStore;
    const tradeHistoryStore = this.props.tradeHistoryStore as TradeHistoryStore;

    const currencyPairId = Number(
      routerStore.location.pathname
        .split("/")
        .filter((i) => i !== "")
        .pop()
    );

    await currencyPairStore.fetchOne(currencyPairId);

    if (currencyPairStore.currencyPair) {
      tradeHistoryStore.subscribe(currencyPairStore.currencyPair);
    }
  }

  componentWillUnmount() {
    const tradeHistoryStore = this.props.tradeHistoryStore as TradeHistoryStore;
    tradeHistoryStore.unsubscribe();
  }

  private setOrderPrice(price: number) {
    const orderStore = this.props.orderStore as OrderStore;
    orderStore.buy.form.price = price;
    orderStore.sell.form.price = price;
  }

  render() {
    const tradeHistoryStore = this.props.tradeHistoryStore as TradeHistoryStore;
    const currencyPairStore = this.props.currencyPairStore as CurrencyPairStore;
    return (
      <TradeHistory
        tradeHistories={tradeHistoryStore.tradeHistories}
        currencyPair={currencyPairStore.currencyPair}
        onPriceClick={this.setOrderPrice}
      />
    );
  }
}
