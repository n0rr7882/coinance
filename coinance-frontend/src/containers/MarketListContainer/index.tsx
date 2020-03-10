import React from 'react';
import { inject, observer } from 'mobx-react';
import CurrencyPairStore from '../../stores/currency-pair';
import MarketList from '../../components/MarketList';
import { Order } from '../../models/common';
import { Currency } from '../../models/currency-pair';

interface IProps {
  currencyPairStore?: CurrencyPairStore;
}

interface IState {
  order: Order;
  orderBy: string;
  selectedCurrencyFrom?: Currency;
}

@inject('currencyPairStore')
@observer
export default class MarketListContainer extends React.Component<IProps, IState> {
  state: IState = {
    order: 'asc',
    orderBy: 'symbol',
  }

  public setOrder(order: Order) {
    this.setState({ ...this.state, order });
  }

  public setOrderBy(orderBy: string) {
    this.setState({ ...this.state, orderBy });
  }

  public setSelectedCurrencyFrom(currency?: Currency) {
    this.setState({ ...this.state, selectedCurrencyFrom: currency });
  }

  constructor(props: IProps) {
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