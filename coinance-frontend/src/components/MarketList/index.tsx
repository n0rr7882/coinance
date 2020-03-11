import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { CurrencyPair, Currency } from '../../models/currency-pair';
import MarketItem from '../MarketItem';
import { observer } from 'mobx-react';
import { TableSortLabel, Toolbar, Typography, Button, Theme, createStyles, Tooltip, ButtonGroup } from '@material-ui/core';
import { Order } from '../../models/common';

enum TableColumn {
  symbol = 'symbol',
  price = '현재가',
  changeRate = '전일대비(%)',
  volume = '거래량(24H)',
}

const useMarketListToolbarStyles = makeStyles((theme: Theme) => createStyles({
  spacer: {
    flexGrow: 1,
  },
}));

interface MarketListToolbarProps {
  currenciesFrom: Currency[];
  selected?: Currency;
  onSelect: (currency?: Currency) => void;
}

const MarketListToolbar: React.FC<MarketListToolbarProps> = props => {
  const classes = useMarketListToolbarStyles();

  return (
    <Toolbar>
      <Typography color="inherit" variant="subtitle1">
        마켓 목록
      </Typography>

      <span className={classes.spacer}></span>

      <ButtonGroup variant="text">

        <Tooltip key={0} title="모두">
          <Button
            color={!props.selected ? 'primary' : 'default'}
            onClick={() => props.onSelect(undefined)}
          >ALL</Button>
        </Tooltip>

        {props.currenciesFrom.map(currency => (
          <Tooltip key={currency.id} title={currency.name}>
            <Button
              color={props.selected?.id === currency.id ? 'primary' : 'default'}
              onClick={() => props.onSelect(currency)}
            >{currency.symbol}</Button>
          </Tooltip>
        ))}

      </ButtonGroup>
    </Toolbar >
  );
}

const useMarketListStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

interface MarketListProps {
  currencyPairs: CurrencyPair[];
  selectedCurrencyFrom?: Currency;
  order: Order;
  orderBy: string;
  setSelectedCurrencyFrom: (currency?: Currency) => void;
  setOrder: (order: Order) => void;
  setOrderBy: (orderBy: string) => void;
}

const MarketList: React.FC<MarketListProps> = props => {
  const classes = useMarketListStyles();

  const currenciesFrom = props.currencyPairs
    .map(currencyPair => currencyPair.currency_from);

  const currenciesFromUnique = currenciesFrom
    .filter((currency, index) => currenciesFrom.findIndex(c => c.id === currency.id) === index);

  const setOrderBy = (orderBy: string) => {
    if (props.orderBy === orderBy) {
      props.setOrder(props.order === 'asc' ? 'desc' : 'asc');
    } else {
      props.setOrderBy(orderBy);
    }
  }

  const sort = (a: CurrencyPair, b: CurrencyPair): number => {
    if (props.orderBy === TableColumn.symbol) {
      return props.order === 'asc'
        ? (a.currency_to.symbol > b.currency_to.symbol ? 0 : -1)
        : (a.currency_to.symbol < b.currency_to.symbol ? 0 : -1);

    } else if (props.orderBy === TableColumn.price) {
      return props.order === 'asc'
        ? (a.exchange_rate.last_trade_price > b.exchange_rate.last_trade_price ? 0 : -1)
        : (a.exchange_rate.last_trade_price < b.exchange_rate.last_trade_price ? 0 : -1);

    } else if (props.orderBy === TableColumn.changeRate) {
      return props.order === 'asc'
        ? (a.exchange_rate.change_rate_24h > b.exchange_rate.change_rate_24h ? 0 : -1)
        : (a.exchange_rate.change_rate_24h < b.exchange_rate.change_rate_24h ? 0 : -1);

    } else if (props.orderBy === TableColumn.volume) {
      return props.order === 'asc'
        ? (a.exchange_rate.quote_volume_24h > b.exchange_rate.quote_volume_24h ? 0 : -1)
        : (a.exchange_rate.quote_volume_24h < b.exchange_rate.quote_volume_24h ? 0 : -1);
    } else {
      return 0;
    }
  }

  const filterExchangeRateExists = (c: CurrencyPair): boolean => {
    return !!c.exchange_rate;
  }

  const filterSelectedCurrencyFrom = (c: CurrencyPair): boolean => {
    if (props.selectedCurrencyFrom) {
      return c.currency_from.id === props.selectedCurrencyFrom.id;
    }
    return true;
  }

  const composedCurrencyPairs = props.currencyPairs
    .filter(filterExchangeRateExists)
    .filter(filterSelectedCurrencyFrom)
    .sort(sort);

  return (
    <Paper>
      <MarketListToolbar
        selected={props.selectedCurrencyFrom}
        onSelect={props.setSelectedCurrencyFrom}
        currenciesFrom={currenciesFromUnique}
      />
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="market list">
          <TableHead>
            <TableRow>

              <TableCell align="left" sortDirection={props.orderBy === TableColumn.symbol ? props.order : false}>
                <TableSortLabel
                  active={props.orderBy === TableColumn.symbol}
                  direction={props.order}
                  onClick={() => setOrderBy(TableColumn.symbol)}>
                  {TableColumn.symbol}
                </TableSortLabel>
              </TableCell>

              <TableCell align="right" sortDirection={props.orderBy === TableColumn.price ? props.order : false}>
                <TableSortLabel
                  active={props.orderBy === TableColumn.price}
                  direction={props.order}
                  onClick={() => setOrderBy(TableColumn.price)}>
                  {TableColumn.price}
                </TableSortLabel>
              </TableCell>

              <TableCell align="right" sortDirection={props.orderBy === TableColumn.changeRate ? props.order : false}>
                <TableSortLabel
                  active={props.orderBy === TableColumn.changeRate}
                  direction={props.order}
                  onClick={() => setOrderBy(TableColumn.changeRate)}>
                  {TableColumn.changeRate}
                </TableSortLabel>
              </TableCell>

              <TableCell align="right" sortDirection={props.orderBy === TableColumn.volume ? props.order : false}>
                <TableSortLabel
                  active={props.orderBy === TableColumn.volume}
                  direction={props.order}
                  onClick={() => setOrderBy(TableColumn.volume)}>
                  {TableColumn.volume}
                </TableSortLabel>
              </TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {composedCurrencyPairs.map(currencyPair => (
              <MarketItem currencyPair={currencyPair} key={currencyPair.id} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default observer(MarketList);