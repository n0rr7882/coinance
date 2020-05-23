import React from 'react';
import { TableRow, TableCell, Chip, Tooltip } from '@material-ui/core';
import { CurrencyPair } from '../../models/currency-pair';
import { observer } from 'mobx-react';
import ButtonLink from '../common/ButtonLink';
import TrendingChip from '../common/TrendingChip';

interface IProps {
  currencyPair: CurrencyPair;
}

@observer
class MarketItem extends React.Component<IProps> {
  render() {
    const { currencyPair } = this.props;
    const symbolFrom = currencyPair.currency_from.symbol;
    const symbolTo = currencyPair.currency_to.symbol;
    const name = currencyPair.currency_to.name;
    const lastTradePrice = currencyPair.exchange_rate?.last_trade_price;
    const changeRate24h = Math.round(currencyPair.exchange_rate?.change_rate_24h * 10000) / 100;
    const baseVolume24h = currencyPair.exchange_rate?.base_volume_24h;

    return (
      <TableRow key={currencyPair.id}>
        <TableCell component="th" scope="row">
          <Tooltip title={name}>
            <ButtonLink to={`/trading/${currencyPair.id}`}>
              <b>{symbolTo}</b>
            </ButtonLink>
          </Tooltip>
        </TableCell>
        <TableCell align="right">
          {lastTradePrice.toFixed(8)} <Chip variant="outlined" size="small" label={symbolFrom} />
        </TableCell>
        <TableCell align="right">
          <TrendingChip value={changeRate24h} />
        </TableCell>
        <TableCell align="right">
          {baseVolume24h.toFixed(8)} <Chip variant="outlined" size="small" label={symbolFrom} />
        </TableCell>
      </TableRow>
    );
  }
}

export default MarketItem;