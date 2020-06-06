import React from 'react';
import { inject, observer } from 'mobx-react';
import CurrencyPairStore from '../../stores/currency-pair';
import MarketList, { MarketListTableColumn } from '../../components/MarketList';
import { Order } from '../../models/common';
import { Currency } from '../../models/currency-pair';

interface Props {
  currencyPairStore?: CurrencyPairStore;
}

interface State {
  order: Order;
  orderBy: string;
  selectedCurrencyFrom?: Currency;
}

@inject('currencyPairStore')
@observer
export default class MarketListContainer extends React.Component<Props, State> {
  state: State = {
    order: 'desc',
    orderBy: MarketListTableColumn.volume,
  };

  private setOrder(order: Order) {
    this.setState({ ...this.state, order });
  }

  private setOrderBy(orderBy: string) {
    this.setState({ ...this.state, orderBy });
  }

  private setSelectedCurrencyFrom(currency?: Currency) {
    this.setState({ ...this.state, selectedCurrencyFrom: currency });
  }

  constructor(props: Props) {
    super(props);
    this.setOrder = this.setOrder.bind(this);
    this.setOrderBy = this.setOrderBy.bind(this);
    this.setSelectedCurrencyFrom = this.setSelectedCurrencyFrom.bind(this);
  }

  componentDidMount() {
    const currencyPairStore = this.props.currencyPairStore!;
    currencyPairStore.fetchAll().then(() => currencyPairStore.subscribeAll());
  }

  componentWillUnmount() {
    const currencyPairStore = this.props.currencyPairStore!;
    currencyPairStore.unsubscribeAll();
  }

  render() {
    const currencyPairStore = this.props.currencyPairStore!;
    return <MarketList
      status={currencyPairStore.status}
      currencyPairs={currencyPairStore.currencyPairs}
      selectedCurrencyFrom={this.state.selectedCurrencyFrom}
      order={this.state.order}
      orderBy={this.state.orderBy}
      setSelectedCurrencyFrom={this.setSelectedCurrencyFrom}
      setOrder={this.setOrder}
      setOrderBy={this.setOrderBy}
    />;
  }
}