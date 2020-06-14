import React from "react";
import { OrderBook as OrderBookModel } from "../../models/order-book";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Table,
  TableContainer,
  makeStyles,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  WithStyles,
  withStyles,
  Button,
  Tooltip,
} from "@material-ui/core";
import { CurrencyPair } from "../../models/currency-pair";
import { f } from "../../utils/number";
import { useHighlightedRowStyles } from "../../utils/styles";

interface OrderBookItemProps
  extends WithStyles<typeof useHighlightedRowStyles> {
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

      const color = isBuy ? "primary" : "secondary";
      const price = Number(orderBookItem[0]);
      const amountCurrencyTo = Number(orderBookItem[1]);
      const amountCurrencyFrom = f(price * amountCurrencyTo);

      const rowClass = this.state.highlighted
        ? classes.highlightedNormal
        : classes.highlightedDefault;

      return (
        <TableRow className={rowClass}>
          <TableCell align="left">
            <Tooltip
              title={`${price.toFixed(8)} 로 거래창 가격 채우기`}
              placement="right"
            >
              <Button
                color={color}
                onClick={this.props.onRowClick}
                size="small"
                variant="contained"
                disableElevation
              >
                {price.toFixed(8)}
              </Button>
            </Tooltip>
          </TableCell>
          <TableCell align="right">
            <Typography color={color}>
              {amountCurrencyFrom.toFixed(8)}
            </Typography>
          </TableCell>
        </TableRow>
      );
    }
  }
);

interface OrderBookListProps {
  currencyPair?: CurrencyPair;
  asks: Array<Array<string | number>>;
  bids: Array<Array<string | number>>;
  onPriceClick: (price: number) => void;
}

const useOrderBookListStyles = makeStyles({
  container: {
    height: 360,
  },
});

const OrderBookList: React.FC<OrderBookListProps> = ({
  currencyPair,
  asks,
  bids,
  onPriceClick,
}) => {
  const classes = useOrderBookListStyles();

  return (
    <Card elevation={0}>
      <CardContent>
        <Typography variant="h5" component="h3">
          주문 장부
        </Typography>
      </CardContent>
      <Divider />
      <TableContainer className={classes.container}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="left">가격</TableCell>
              <TableCell align="right">
                총액({currencyPair?.currency_from.symbol || "..."})
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bids
              .slice()
              .reverse()
              .map((orderBookItem) => (
                <OrderBookItem
                  key={orderBookItem[0]}
                  isBuy={true}
                  orderBookItem={orderBookItem}
                  onRowClick={() => onPriceClick(Number(orderBookItem[0]))}
                />
              ))}
            {asks.map((orderBookItem) => (
              <OrderBookItem
                key={orderBookItem[0]}
                isBuy={false}
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
  onPriceClick: (price: number) => void;
}

const OrderBook: React.FC<Props> = (props) => (
  <OrderBookList
    currencyPair={props.currencyPair}
    asks={props.orderBook?.asks || []}
    bids={props.orderBook?.bids || []}
    onPriceClick={props.onPriceClick}
  />
);

export default OrderBook;
