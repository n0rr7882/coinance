import React from 'react';
import { OrderBook as OrderBookModel } from '../../models/order-book';
import { Card, CardContent, Typography, Divider, Table, TableContainer, makeStyles, Grid, TableRow, TableHead, TableCell, TableBody } from '@material-ui/core';
import { CurrencyPair } from '../../models/currency-pair';
import { f } from '../../utils/number';

interface OrderBookItemProps {
  orderBookItem: Array<string | number>;
  onRowClick: () => void;
}

const OrderBookItem: React.FC<OrderBookItemProps> = ({ orderBookItem, onRowClick }) => {
  const price = Number(orderBookItem[0]);
  const amountCurrencyTo = Number(orderBookItem[1]);
  const amountCurrencyFrom = f(price * amountCurrencyTo);

  return (
    <TableRow onClick={onRowClick}>
      <TableCell align="right">
        {price.toFixed(8)}
      </TableCell>
      <TableCell align="right">
        {amountCurrencyTo.toFixed(8)}
      </TableCell>
      <TableCell align="right">
        {amountCurrencyFrom.toFixed(8)}
      </TableCell>
    </TableRow>
  );
};

interface OrderBookListProps {
  isBuy: boolean;
  currencyPair?: CurrencyPair;
  orderBookList: Array<Array<string | number>>;
  onPriceClick: (price: number) => void;
}

const useOrderBookListStyles = makeStyles({
  container: {
    height: 360,
  },
});

const OrderBookList: React.FC<OrderBookListProps> = ({ isBuy, currencyPair, orderBookList, onPriceClick }) => {
  const classes = useOrderBookListStyles();

  return (
    <Card elevation={0}>
      <CardContent>
        <Typography variant="h5" component="h3">
          {isBuy ? '매수' : '매도'} 호가
        </Typography>
      </CardContent>
      <Divider />
      <TableContainer className={classes.container}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="right">가격</TableCell>
              <TableCell align="right">{currencyPair?.currency_to.symbol || '...'}</TableCell>
              <TableCell align="right">{currencyPair?.currency_from.symbol || '...'}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderBookList.map(orderBookItem => (
              <OrderBookItem
                key={orderBookItem[0]}
                orderBookItem={orderBookItem}
                onRowClick={() => onPriceClick(Number(orderBookItem[0]))}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

interface Props {
  orderBook?: OrderBookModel;
  currencyPair?: CurrencyPair;
  onBuyPriceClick: (price: number) => void;
  onSellPriceClick: (price: number) => void;
}

const OrderBook: React.FC<Props> = props => (
  <Grid container>
    <Grid item xs={12} md={6}>
      <OrderBookList
        isBuy={true}
        currencyPair={props.currencyPair}
        orderBookList={props.orderBook?.bids || []}
        onPriceClick={props.onBuyPriceClick}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <OrderBookList
        isBuy={false}
        currencyPair={props.currencyPair}
        orderBookList={props.orderBook?.asks || []}
        onPriceClick={props.onSellPriceClick}
      />
    </Grid>
  </Grid>
)

export default OrderBook;