import React from 'react';
import { TableRow, TableCell, Chip } from '@material-ui/core';
import { CurrencyPair } from '../../models/currency-pair';
import { observer } from 'mobx-react';
import { TrendingUp, TrendingDown, TrendingFlat } from '@material-ui/icons';

interface IProps {
  currencyPair: CurrencyPair;
}

@observer
class MarketItem extends React.Component<IProps, {}> {

  componentDidUpdate() {

    const { currencyPair } = this.props;
    console.log(currencyPair)
  }

  render() {
    const { currencyPair } = this.props;
    const symbolFrom = currencyPair.currency_from.symbol;
    const symbolTo = currencyPair.currency_to.symbol;
    const name = currencyPair.currency_to.name;
    const lastTradePrice = currencyPair.exchange_rate?.last_trade_price;
    const changeRate24h = Math.round(currencyPair.exchange_rate?.change_rate_24h * 10000) / 100;
    const chipColor = changeRate24h === 0 ? 'inherit' : changeRate24h > 0 ? 'secondary' : 'primary';
    const chipIcon = changeRate24h === 0 ? <TrendingFlat /> : changeRate24h >= 0 ? <TrendingUp /> : <TrendingDown />;
    const changeRateChip = (
      <Chip
        label={`${changeRate24h}%`}
        color={chipColor}
        icon={chipIcon}
      />
    );
    const quoteVolume24h = currencyPair.exchange_rate?.quote_volume_24h;

    return (
      <TableRow key={currencyPair.id}>
        <TableCell component="th" scope="row">
          <b>{symbolTo}</b>
        </TableCell>
        <TableCell align="right">
          {lastTradePrice}
        </TableCell>
        <TableCell align="right">
          {changeRateChip}
        </TableCell>
        <TableCell align="right">
          {quoteVolume24h}({symbolFrom})
        </TableCell>
        <TableCell>
          {name}
        </TableCell>
      </TableRow>
    );
  }
}

export default MarketItem;