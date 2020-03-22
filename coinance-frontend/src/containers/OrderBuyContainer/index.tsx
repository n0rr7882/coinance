import React from 'react';
import Order from '../../components/Order';
import { inject, observer } from 'mobx-react';
import OrderStore from '../../stores/order';
import { RouterStore } from 'mobx-react-router';
import CurrencyPairStore from '../../stores/currency-pair';
import { OrderType } from '../../models/order';
import { autorun, IReactionDisposer } from 'mobx';

interface Props {
  routerStore?: RouterStore;
  orderStore?: OrderStore;
  currencyPairStore?: CurrencyPairStore;
}

interface State {
  useMarketPrice: boolean;
}

@inject('routerStore', 'orderStore', 'currencyPairStore')
@observer
export default class OrderBuyContainer extends React.Component<Props, State> {
  useMarketPriceDisposer?: IReactionDisposer;

  state: State = { useMarketPrice: false };

  constructor(props: Props) {
    super(props);
    this.create = this.create.bind(this);
    this.setMaxAmount = this.setMaxAmount.bind(this);
    this.setUseMarketPrice = this.setUseMarketPrice.bind(this);
  }

  componentDidMount() {
    const currencyPairStore = this.props.currencyPairStore!;
    const orderStore = this.props.orderStore!;

    this.useMarketPriceDisposer = autorun(() => {
      if (this.state.useMarketPrice && currencyPairStore.currencyPair) {
        orderStore.buy.form.price = currencyPairStore.currencyPair.exchange_rate.lowest_ask;
      }
    });
  }

  componentWillUnmount() {
    if (this.useMarketPriceDisposer) {
      this.useMarketPriceDisposer();
    }
  }

  private async create() {
    const orderStore = this.props.orderStore!;
    const currencyPairStore = this.props.currencyPairStore!;

    if (currencyPairStore.currencyPair) {
      orderStore.buy.form.currency_pair = currencyPairStore.currencyPair.id;
      const succeed = await orderStore.createBuy();

      if (succeed) {
        orderStore.initializeBuyForm(currencyPairStore.currencyPair);
      }
    }
  }

  private setUseMarketPrice(checked: boolean) {
    this.setState({ useMarketPrice: checked });
  }

  private setMaxAmount() {
    alert('최대 매수량을 누르셨습니당ㅇㅇㅇㅇ');
  }

  render() {
    const orderStore = this.props.orderStore!;
    const currencyPairStore = this.props.currencyPairStore!;

    return (
      <Order
        status={orderStore.buy.status}
        errors={orderStore.buy.errors}
        orderType={OrderType.buy}
        currencyPair={currencyPairStore.currencyPair}
        control={orderStore.buy}
        useMarketPrice={this.state.useMarketPrice}
        setUseMarketPrice={this.setUseMarketPrice}
        setMaxAmount={this.setMaxAmount}
        create={this.create}
      />
    );
  }
}