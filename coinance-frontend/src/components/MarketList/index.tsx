import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { CurrencyPair, Currency } from '../../models/currency-pair';
import MarketItem from '../MarketItem';
import { observer } from 'mobx-react';
import { TableSortLabel, Typography, Button, Tooltip, ButtonGroup, CardContent, Card, Grid } from '@material-ui/core';
import { Order, Status } from '../../models/common';
import LoadingBackdrop from '../common/LoadingBackdrop';

export enum MarketListTableColumn {
  symbol = 'Symbol',
  price = '현재가',
  changeRate = '전일대비(%)',
  volume = '거래량(24H)',
}

const useMarketListToolbarStyles = makeStyles({
  spacer: {
    flexGrow: 1,
  },
});

interface MarketListToolbarProps {
  currenciesFrom: Currency[];
  selected?: Currency;
  onSelect: (currency?: Currency) => void;
}

const MarketListToolbar: React.FC<MarketListToolbarProps> = props => {
  const classes = useMarketListToolbarStyles();

  return (
    <CardContent>
      <Grid container justify="space-between">
        <Grid item>
          <Typography variant="h5" component="h3">
            마켓 목록
          </Typography>
        </Grid>
        <Grid item>
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
        </Grid>
      </Grid>
    </CardContent>
  );
}

interface MarketListProps {
  status: Status;
  currencyPairs: CurrencyPair[];
  selectedCurrencyFrom?: Currency;
  order: Order;
  orderBy: string;
  setSelectedCurrencyFrom: (currency?: Currency) => void;
  setOrder: (order: Order) => void;
  setOrderBy: (orderBy: string) => void;
}

const MarketList: React.FC<MarketListProps> = props => {
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
    .slice()
    .sort(sort);

  return (
    <Card elevation={0}>
      <MarketListToolbar
        selected={props.selectedCurrencyFrom}
        onSelect={props.setSelectedCurrencyFrom}
        currenciesFrom={currenciesFromUnique}
      />
      <LoadingBackdrop open={props.status === Status.pending} />
      <TableContainer>
        <Table aria-label="market list" stickyHeader>
          <TableHead>
            <TableRow>

              <TableCell align="left" sortDirection={props.orderBy === MarketListTableColumn.symbol ? props.order : false}>
                <TableSortLabel
                  active={props.orderBy === MarketListTableColumn.symbol}
                  direction={props.order}
                  onClick={() => setOrderBy(MarketListTableColumn.symbol)}
                >
                  <Typography noWrap>
                    {MarketListTableColumn.symbol}
                  </Typography>
                </TableSortLabel>
              </TableCell>

              <TableCell align="right" sortDirection={props.orderBy === MarketListTableColumn.price ? props.order : false}>
                <TableSortLabel
                  active={props.orderBy === MarketListTableColumn.price}
                  direction={props.order}
                  onClick={() => setOrderBy(MarketListTableColumn.price)}
                >
                  <Typography noWrap>
                    {MarketListTableColumn.price}
                  </Typography>
                </TableSortLabel>
              </TableCell>

              <TableCell align="right" sortDirection={props.orderBy === MarketListTableColumn.changeRate ? props.order : false}>
                <TableSortLabel
                  active={props.orderBy === MarketListTableColumn.changeRate}
                  direction={props.order}
                  onClick={() => setOrderBy(MarketListTableColumn.changeRate)}
                >
                  <Typography noWrap>
                    {MarketListTableColumn.changeRate}
                  </Typography>
                </TableSortLabel>
              </TableCell>

              <TableCell align="right" sortDirection={props.orderBy === MarketListTableColumn.volume ? props.order : false}>
                <TableSortLabel
                  active={props.orderBy === MarketListTableColumn.volume}
                  direction={props.order}
                  onClick={() => setOrderBy(MarketListTableColumn.volume)}
                >
                  <Typography noWrap>
                    {MarketListTableColumn.volume}
                  </Typography>
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
    </Card>
  );
}

export default observer(MarketList);