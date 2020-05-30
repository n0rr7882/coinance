import React from 'react';
import { inject, observer } from 'mobx-react';
import { RouterStore } from 'mobx-react-router';
import OrderBookStore from '../../stores/order-book';
import CurrencyPairStore from '../../stores/currency-pair';
import OrderBook from '../../components/OrderBook';
import OrderStore from '../../stores/order';

interface Props {
  routerStore?: RouterStore;
  orderBookStore?: OrderBookStore;
  currencyPairStore?: CurrencyPairStore;
  orderStore?: OrderStore;
}

@inject('routerStore', 'orderBookStore', 'currencyPairStore', 'orderStore')
@observer
export default class OrderBookContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.setOrderPrice = this.setOrderPrice.bind(this);
  }

  async componentDidMount() {
    const routerStore = this.props.routerStore as RouterStore;
    const currencyPairStore = this.props.currencyPairStore as CurrencyPairStore;
    const orderBookStore = this.props.orderBookStore as OrderBookStore;

    const currencyPairId = Number(routerStore.location.pathname.split('/').filter(i => i !== '').pop());

    await currencyPairStore.fetchOne(currencyPairId);

    if (currencyPairStore.currencyPair) {
      orderBookStore.subscribe(currencyPairStore.currencyPair);
    }
  }

  componentWillUnmount() {
    const orderBookStore = this.props.orderBookStore as OrderBookStore;
    orderBookStore.unsubscribe();
  }

  private setOrderPrice(price: number) {
    const orderStore = this.props.orderStore as OrderStore;
    orderStore.buy.form.price = price;
    orderStore.sell.form.price = price;
  }

  render() {
    const orderBookStore = this.props.orderBookStore as OrderBookStore;
    const currencyPairStore = this.props.currencyPairStore as CurrencyPairStore;
    return (
      <OrderBook
        orderBook={orderBookStore.orderBook}
        currencyPair={currencyPairStore.currencyPair}
        onPriceClick={this.setOrderPrice}
      />
    );
  }
}