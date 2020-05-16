import React from 'react';
import WalletStore from "../../stores/wallet";
import { inject, observer } from "mobx-react";
import WalletList, { WalletListTableColumn } from "../../components/WalletList";
import { Order } from "../../models/common";

interface IProps {
  walletStore?: WalletStore;
}

interface IState {
  order: Order;
  orderBy: string;
}

@inject('walletStore')
@observer
export default class WalletListContainer extends React.Component<IProps, IState> {
  state: IState = {
    order: 'asc',
    orderBy: WalletListTableColumn.symbol,
  };

  public setOrder(order: Order) {
    this.setState({ ...this.state, order });
  }

  public setOrderBy(orderBy: string) {
    this.setState({ ...this.state, orderBy });
  }

  constructor(props: IProps) {
    super(props);
    this.setOrder = this.setOrder.bind(this);
    this.setOrderBy = this.setOrderBy.bind(this);
  }

  render() {
    const walletStore = this.props.walletStore as WalletStore;
    return <WalletList
      status={walletStore.status}
      wallets={walletStore.wallets}
      order={this.state.order}
      orderBy={this.state.orderBy}
      setOrder={this.setOrder}
      setOrderBy={this.setOrderBy}
    />;
  }
}