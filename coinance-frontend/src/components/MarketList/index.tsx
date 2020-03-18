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

export enum MarketListTableColumn {
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
    if (props.orderBy === MarketListTableColumn.symbol) {
      return props.order === 'asc'
        ? (a.currency_to.symbol > b.currency_to.symbol ? 0 : -1)
        : (a.currency_to.symbol < b.currency_to.symbol ? 0 : -1);

    } else if (props.orderBy === MarketListTableColumn.price) {
      return props.order === 'asc'
        ? (a.exchange_rate.last_trade_price > b.exchange_rate.last_trade_price ? 0 : -1)
        : (a.exchange_rate.last_trade_price < b.exchange_rate.last_trade_price ? 0 : -1);

    } else if (props.orderBy === MarketListTableColumn.changeRate) {
      return props.order === 'asc'
        ? (a.exchange_rate.change_rate_24h > b.exchange_rate.change_rate_24h ? 0 : -1)
        : (a.exchange_rate.change_rate_24h < b.exchange_rate.change_rate_24h ? 0 : -1);

    } else if (props.orderBy === MarketListTableColumn.volume) {
      return props.order === 'asc'
        ? (a.exchange_rate.base_volume_24h > b.exchange_rate.base_volume_24h ? 0 : -1)
        : (a.exchange_rate.base_volume_24h < b.exchange_rate.base_volume_24h ? 0 : -1);
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
    <Paper elevation={0}>
      <MarketListToolbar
        selected={props.selectedCurrencyFrom}
        onSelect={props.setSelectedCurrencyFrom}
        currenciesFrom={currenciesFromUnique}
      />
      <TableContainer>
        <Table className={classes.table} aria-label="market list">
          <TableHead>
            <TableRow>

              <TableCell align="left" sortDirection={props.orderBy === MarketListTableColumn.symbol ? props.order : false}>
                <TableSortLabel
                  active={props.orderBy === MarketListTableColumn.symbol}
                  direction={props.order}
                  onClick={() => setOrderBy(MarketListTableColumn.symbol)}>
                  {MarketListTableColumn.symbol}
                </TableSortLabel>
              </TableCell>

              <TableCell align="right" sortDirection={props.orderBy === MarketListTableColumn.price ? props.order : false}>
                <TableSortLabel
                  active={props.orderBy === MarketListTableColumn.price}
                  direction={props.order}
                  onClick={() => setOrderBy(MarketListTableColumn.price)}>
                  {MarketListTableColumn.price}
                </TableSortLabel>
              </TableCell>

              <TableCell align="right" sortDirection={props.orderBy === MarketListTableColumn.changeRate ? props.order : false}>
                <TableSortLabel
                  active={props.orderBy === MarketListTableColumn.changeRate}
                  direction={props.order}
                  onClick={() => setOrderBy(MarketListTableColumn.changeRate)}>
                  {MarketListTableColumn.changeRate}
                </TableSortLabel>
              </TableCell>

              <TableCell align="right" sortDirection={props.orderBy === MarketListTableColumn.volume ? props.order : false}>
                <TableSortLabel
                  active={props.orderBy === MarketListTableColumn.volume}
                  direction={props.order}
                  onClick={() => setOrderBy(MarketListTableColumn.volume)}>
                  {MarketListTableColumn.volume}
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