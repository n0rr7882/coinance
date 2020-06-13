import React from 'react';
import { makeStyles, Typography, LinearProgress, TableContainer, Table, TableHead, TableRow, TableCell, TableSortLabel, TableBody, CardContent, Card } from "@material-ui/core";
import { Wallet } from '../../models/wallet';
import { Order, Status } from '../../models/common';
import WalletItem from '../WalletItem';
import { observer } from 'mobx-react';

export enum WalletListTableColumn {
  symbol = 'Symbol',
  amount = '보유량',
  aggregatedAmountForStartCurrencyPrice = '보유량(초기자금기준)'
}

const WalletListToolbar: React.FC = () => {
  return (
    <CardContent>
      <Typography variant="h5" component="h3">
        나의 보유화폐
      </Typography>
    </CardContent>
  )
}

const useWalletListStyles = makeStyles({
  table: {
    minwidth: 650,
  },
});

interface WalletListProps {
  status: Status;
  wallets: Wallet[];
  order: Order;
  orderBy: string;
  setOrder: (order: Order) => void;
  setOrderBy: (orderBy: string) => void;
}

const WalletList: React.FC<WalletListProps> = observer(props => {
  const classes = useWalletListStyles();

  const setOrderBy = (orderBy: string) => {
    if (props.orderBy === orderBy) {
      props.setOrder(props.order === 'asc' ? 'desc' : 'asc');
    } else {
      props.setOrderBy(orderBy);
    }
  }

  const sort = (a: Wallet, b: Wallet): number => {
    if (props.orderBy === WalletListTableColumn.symbol) {
      return props.order === 'asc'
        ? (a.currency.symbol > b.currency.symbol ? 0 : -1)
        : (a.currency.symbol < b.currency.symbol ? 0 : -1);

    } else if (props.orderBy === WalletListTableColumn.aggregatedAmountForStartCurrencyPrice) {
      return props.order === 'asc'
        ? (a.aggregated_amount_to_start_currency_price > b.aggregated_amount_to_start_currency_price ? 0 : -1)
        : (a.aggregated_amount_to_start_currency_price < b.aggregated_amount_to_start_currency_price ? 0 : -1);

    } else {
      return 0;
    }
  }

  const filterAmountExists = (w: Wallet): boolean => {
    return w.amount !== 0;
  }

  const composedWallets = props.wallets
    .filter(filterAmountExists)
    .slice()
    .sort(sort);

  return (
    <Card elevation={0}>
      <WalletListToolbar />
      {props.status === Status.pending ? <LinearProgress /> : <></>}
      <TableContainer>
        <Table className={classes.table} area-label="wallet list">
          <TableHead>
            <TableRow>

              <TableCell align="left" sortDirection={props.orderBy === WalletListTableColumn.symbol ? props.order : false}>
                <TableSortLabel
                  active={props.orderBy === WalletListTableColumn.symbol}
                  direction={props.order}
                  onClick={() => setOrderBy(WalletListTableColumn.symbol)}>
                  {WalletListTableColumn.symbol}
                </TableSortLabel>
              </TableCell>

              <TableCell align="right">
                {WalletListTableColumn.amount}
              </TableCell>

              <TableCell align="right" sortDirection={props.orderBy === WalletListTableColumn.aggregatedAmountForStartCurrencyPrice ? props.order : false}>
                <TableSortLabel
                  active={props.orderBy === WalletListTableColumn.aggregatedAmountForStartCurrencyPrice}
                  direction={props.order}
                  onClick={() => setOrderBy(WalletListTableColumn.aggregatedAmountForStartCurrencyPrice)}>
                  {WalletListTableColumn.aggregatedAmountForStartCurrencyPrice}
                </TableSortLabel>
              </TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {composedWallets.map(wallet => (
              <WalletItem wallet={wallet} key={wallet.id} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
});

export default WalletList;