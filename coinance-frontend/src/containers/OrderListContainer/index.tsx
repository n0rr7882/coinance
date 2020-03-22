import React from 'react';
import OrderList from '../../components/OrderList';
import { inject, observer } from 'mobx-react';
import { RouterStore } from 'mobx-react-router';
import OrderStore from '../../stores/order';
import CurrencyPairStore from '../../stores/currency-pair';
import { hasAuthToken } from '../../utils/token';
import AuthStore from '../../stores/auth';
import { User } from '../../models/user';

interface Props {
  routerStore?: RouterStore;
  authStore?: AuthStore;
  orderStore?: OrderStore;
  currencyPairStore?: CurrencyPairStore;
}

@inject('routerStore', 'authStore', 'orderStore', 'currencyPairStore')
@observer
export default class OrderListContainer extends React.Component<Props> {
  private subscribedUser?: User;

  async componentDidMount() {
    const orderStore = this.props.orderStore!;
    const authStore = this.props.authStore!;

    if (hasAuthToken()) {
      await orderStore.fetchAll();
      orderStore.subscribe();
      this.subscribedUser = authStore.me;
    }
  }

  componentWillUnmount() {
    if (this.subscribedUser) {
      const orderStore = this.props.orderStore!;
      orderStore.unsubscribe(this.subscribedUser);
    }
  }

  render() {
    const orderStore = this.props.orderStore!;
    const routerStore = this.props.routerStore!;

    const currencyPairId = Number(routerStore.location.pathname.split('/').filter(i => i !== '').pop());
    const composedOrders = orderStore.orders
      .filter(o => o.currency_pair.id === currencyPairId)
      .sort((a, b) => Number(b.created) - Number(a.created));

    return (
      <OrderList showCurrency={true} orders={composedOrders} onCancel={orderStore.cancel} />
    );
  }
}