import React from 'react';
import Order from '../../components/Order';
import { inject, observer } from 'mobx-react';
import OrderStore from '../../stores/order';
import { RouterStore } from 'mobx-react-router';
import CurrencyPairStore from '../../stores/currency-pair';
import { OrderType } from '../../models/order';

interface Props {
  routerStore?: RouterStore;
  orderStore?: OrderStore;
  currencyPairStore?: CurrencyPairStore;
}

@inject('routerStore', 'orderStore', 'currencyPairStore')
@observer
export default class OrderSellContainer extends React.Component<Props> {

  constructor(props: Props) {
    super(props);
    this.create = this.create.bind(this);
    this.setMaxAmount = this.setMaxAmount.bind(this);
  }

  private async create() {
    const orderStore = this.props.orderStore!;
    const currencyPairStore = this.props.currencyPairStore!;

    if (currencyPairStore.currencyPair) {
      orderStore.sell.form.currency_pair = currencyPairStore.currencyPair.id;
      const succeed = await orderStore.createSell();

      if (succeed) {
        orderStore.initializeSellForm(currencyPairStore.currencyPair);
      }
    }
  }

  private setMaxAmount() {
    console.log('최대 매도량을 누르셨습니당ㅇㅇㅇㅇ');
  }

  render() {
    const orderStore = this.props.orderStore!;
    const currencyPairStore = this.props.currencyPairStore!;

    return (
      <Order
        status={orderStore.sell.status}
        errors={orderStore.sell.errors}
        orderType={OrderType.sell}
        currencyPair={currencyPairStore.currencyPair}
        control={orderStore.sell}
        setMaxAmount={this.setMaxAmount}
        create={this.create}
      />
    );
  }
}