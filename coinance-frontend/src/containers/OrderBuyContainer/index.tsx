import React from 'react';
import Order from '../../components/Order';
import { inject, observer } from 'mobx-react';
import OrderStore from '../../stores/order';
import WalletStore from '../../stores/wallet';
import CurrencyPairStore from '../../stores/currency-pair';
import { RouterStore } from 'mobx-react-router';
import { OrderType } from '../../models/order';
import { autorun, IReactionDisposer } from 'mobx';
import { f } from '../../utils/number';

interface Props {
  routerStore?: RouterStore;
  orderStore?: OrderStore;
  walletStore?: WalletStore;
  currencyPairStore?: CurrencyPairStore;
}

interface State {
  useMarketPrice: boolean;
}

@inject('routerStore', 'orderStore', 'walletStore', 'currencyPairStore')
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

  private get wallet() {
    const walletStore = this.props.walletStore!;
    const currencyPairStore = this.props.currencyPairStore;
    return walletStore.wallets
      .find(w => w.currency.id === currencyPairStore?.currencyPair?.currency_from.id);
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
    const orderStore = this.props.orderStore!;

    const price = orderStore.buy.form.price;
    const maxAmount = (this.wallet?.available_amount || 0) / price;

    orderStore.buy.form.amount = f(maxAmount || 0);
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
        wallet={this.wallet}
        control={orderStore.buy}
        useMarketPrice={this.state.useMarketPrice}
        setUseMarketPrice={this.setUseMarketPrice}
        setMaxAmount={this.setMaxAmount}
        create={this.create}
      />
    );
  }
}