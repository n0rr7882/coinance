import React, { Props } from 'react';
import { inject, observer } from 'mobx-react';
import CurrencyPairStore from '../../stores/currency-pair';
import MarketList from '../../components/MarketList';

interface IProps extends Props<{}> {
  currencyPairStore?: CurrencyPairStore;
}

@inject('currencyPairStore')
@observer
export default class MarketListContainer extends React.Component<IProps, {}> {
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
    />;
  }
}