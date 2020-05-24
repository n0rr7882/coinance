import React from 'react';
import { TableRow, TableCell, Chip, Tooltip, WithStyles, withStyles } from '@material-ui/core';
import { CurrencyPair } from '../../models/currency-pair';
import { observer } from 'mobx-react';
import ButtonLink from '../common/ButtonLink';
import TrendingChip from '../common/TrendingChip';
import { highlightedRowStyles } from '../../utils/styles';

interface Props extends WithStyles<typeof highlightedRowStyles> {
  currencyPair: CurrencyPair;
}

interface State {
  highlightedUp: boolean;
  highlightedDown: boolean;
}

@observer
class MarketItem extends React.Component<Props, State> {
  private timer?: number;

  state: State = {
    highlightedUp: false,
    highlightedDown: false,
  };

  componentDidUpdate(prevProps: Readonly<Props>) {
    const prevLastTradePrice = prevProps.currencyPair.exchange_rate.last_trade_price;
    const nextLastTradePrice = this.props.currencyPair.exchange_rate.last_trade_price;

    if (prevLastTradePrice < nextLastTradePrice) {
      this.toggleHighlightedUp();
    } else if (prevLastTradePrice > nextLastTradePrice) {
      this.toggleHighlightedDown();
    }
  }

  componentWillUnmount() {
    this.clearHighlight();
  }

  private clearHighlight() {
    this.setState({ highlightedUp: false, highlightedDown: false });

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }

  private toggleHighlightedUp() {
    this.clearHighlight();
    this.setState(state => ({ ...state, highlightedUp: true }));
    this.timer = setTimeout(() => {
      this.setState(state => ({ ...state, highlightedUp: false }));
    }, 1000);
  }

  private toggleHighlightedDown() {
    this.clearHighlight();
    this.setState(state => ({ ...state, highlightedDown: true }));
    this.timer = setTimeout(() => {
      this.setState(state => ({ ...state, highlightedDown: false }))
    }, 1000);
  }

  render() {
    const { currencyPair, classes } = this.props;
    const symbolFrom = currencyPair.currency_from.symbol;
    const symbolTo = currencyPair.currency_to.symbol;
    const nameFrom = currencyPair.currency_from.name;
    const nameTo = currencyPair.currency_to.name;
    const lastTradePrice = currencyPair.exchange_rate?.last_trade_price;
    const changeRate24h = Math.round(currencyPair.exchange_rate?.change_rate_24h * 10000) / 100;
    const baseVolume24h = currencyPair.exchange_rate?.base_volume_24h;

    const rowClass = this.state.highlightedUp ? classes.highlightedUp
      : this.state.highlightedDown ? classes.highlightedDown
        : classes.highlightedDefault;

    return (
      <TableRow key={currencyPair.id} className={rowClass}>
        <TableCell component="th" scope="row">
          <Tooltip title={`${nameTo} / ${nameFrom}`}>
            <ButtonLink to={`/trading/${currencyPair.id}`} variant="outlined">
              <b>{symbolTo}/{symbolFrom}</b>
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

export default withStyles(highlightedRowStyles)(MarketItem);