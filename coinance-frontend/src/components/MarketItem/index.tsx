import React from 'react';
import { TableRow, TableCell, Chip, Tooltip, WithStyles, withStyles, Button, Typography } from '@material-ui/core';
import { CurrencyPair } from '../../models/currency-pair';
import { observer } from 'mobx-react';
import TrendingChip from '../common/TrendingChip';
import { useHighlightedRowStyles } from '../../utils/styles';
import { Link } from 'react-router-dom';

interface Props extends WithStyles<typeof useHighlightedRowStyles> {
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
    }, 50);
  }

  private toggleHighlightedDown() {
    this.clearHighlight();
    this.setState(state => ({ ...state, highlightedDown: true }));
    this.timer = setTimeout(() => {
      this.setState(state => ({ ...state, highlightedDown: false }))
    }, 50);
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
            <Link to={`/trading/${currencyPair.id}`}>
              <Button variant="outlined">
                <b>{symbolTo}/{symbolFrom}</b>
              </Button>
            </Link>
          </Tooltip>
        </TableCell>
        <TableCell align="right">
          <Typography component="span" noWrap>
            {lastTradePrice.toFixed(8)} <Chip variant="outlined" size="small" label={symbolFrom} />
          </Typography>
        </TableCell>
        <TableCell align="right">
          <TrendingChip value={changeRate24h} />
        </TableCell>
        <TableCell align="right">
          <Typography component="span" noWrap>
            {baseVolume24h.toFixed(8)} <Chip variant="outlined" size="small" label={symbolFrom} />
          </Typography>
        </TableCell>
      </TableRow>
    );
  }
}

export default withStyles(useHighlightedRowStyles)(MarketItem);