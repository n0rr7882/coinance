import React from "react";
import OrderList from "../../components/OrderList";
import { inject, observer } from "mobx-react";
import OrderStore from "../../stores/order";
import CurrencyPairStore from "../../stores/currency-pair";
import { hasAuthToken } from "../../utils/token";

interface Props {
  orderStore?: OrderStore;
  currencyPairStore?: CurrencyPairStore;
}

@inject("orderStore", "currencyPairStore")
@observer
export default class OrderListContainer extends React.Component<Props> {
  async componentDidMount() {
    const orderStore = this.props.orderStore as OrderStore;

    if (hasAuthToken()) {
      await orderStore.fetchAll();
    }
  }

  render() {
    const orderStore = this.props.orderStore!;

    const composedOrders = orderStore.orders
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
