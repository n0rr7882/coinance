import React from "react";
import OrderList from "../../components/OrderList";
import { inject, observer } from "mobx-react";
import { RouterStore } from "mobx-react-router";
import OrderStore from "../../stores/order";
import CurrencyPairStore from "../../stores/currency-pair";
import { hasAuthToken } from "../../utils/token";
import AuthStore from "../../stores/auth";

interface Props {
  routerStore?: RouterStore;
  authStore?: AuthStore;
  orderStore?: OrderStore;
  currencyPairStore?: CurrencyPairStore;
}

@inject("routerStore", "authStore", "orderStore", "currencyPairStore")
@observer
export default class OrderListCurrencyContainer extends React.Component<Props> {
  async componentDidMount() {
    const orderStore = this.props.orderStore!;

    if (hasAuthToken()) {
      await orderStore.fetchAll();
    }
  }

  render() {
    const orderStore = this.props.orderStore!;
    const routerStore = this.props.routerStore!;

    const currencyPairId = Number(
      routerStore.location.pathname
        .split("/")
        .filter((i) => i !== "")
        .pop()
    );
    const composedOrders = orderStore.orders
      .filter((o) => o.currency_pair.id === currencyPairId)
      .slice()
      .sort((a, b) => Number(b.created) - Number(a.created));

    return (
      <OrderList
        status={orderStore.status}
        errors={orderStore.errors}
        orders={composedOrders}
        onCancel={orderStore.cancel}
      />
    );
  }
}
