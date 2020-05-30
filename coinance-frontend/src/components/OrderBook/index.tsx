import React from 'react';
import { OrderBook as OrderBookModel } from '../../models/order-book';
import { Card, CardContent, Typography, Divider, Table, TableContainer, makeStyles, Grid, TableRow, TableHead, TableCell, TableBody, WithStyles, withStyles } from '@material-ui/core';
import { CurrencyPair } from '../../models/currency-pair';
import { f } from '../../utils/number';
import { useHighlightedRowStyles } from '../../utils/styles';

interface OrderBookItemProps extends WithStyles<typeof useHighlightedRowStyles> {
  isBuy: boolean;
  orderBookItem: Array<string | number>;
  onRowClick: () => void;
}

interface State {
  highlighted: boolean;
}

const OrderBookItem = withStyles(useHighlightedRowStyles)(
  class extends React.Component<OrderBookItemProps> {
    private timer?: number;

    state: State = {
      highlighted: false,
    };

    componentDidMount() {
      this.toggleHighlighted();
    }

    componentDidUpdate(prevProps: Readonly<OrderBookItemProps>) {
      const prevAmount = prevProps.orderBookItem[1];
      const nextAmount = this.props.orderBookItem[1];

      if (prevAmount !== nextAmount) {
        this.toggleHighlighted();
      }
    }

    componentWillUnmount() {
      this.clearHighlight();
    }

    private clearHighlight() {
      this.setState({ highlighted: false });

      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = undefined;
      }
    }

    private toggleHighlighted() {
      this.clearHighlight();
      this.setState({ highlighted: true });
      this.timer = setTimeout(() => {
        this.setState({ highlighted: false });
      }, 100);
    }

    render() {
      const { classes, isBuy, orderBookItem } = this.props;

      const price = Number(orderBookItem[0]);
      const amountCurrencyTo = Number(orderBookItem[1]);
      const amountCurrencyFrom = f(price * amountCurrencyTo);

      const rowClass = isBuy
        ? this.state.highlighted ? classes.highlightedUp : classes.highlightedDefault
        : this.state.highlighted ? classes.highlightedDown : classes.highlightedDefault;

      return (
        <TableRow onClick={this.props.onRowClick} className={rowClass}>
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
    }
  }
);

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
                isBuy={isBuy}
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
        orderBookList={props.orderBook?.asks || []}
        onPriceClick={props.onBuyPriceClick}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <OrderBookList
        isBuy={false}
        currencyPair={props.currencyPair}
        orderBookList={props.orderBook?.bids || []}
        onPriceClick={props.onSellPriceClick}
      />
    </Grid>
  </Grid>
)

export default OrderBook;