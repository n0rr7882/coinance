import React from "react";
import { TradeHistory as TradeHistoryModel } from "../../models/trade-history";
import { CurrencyPair } from "../../models/currency-pair";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  TableContainer,
  TableHead,
  Table,
  TableRow,
  TableCell,
  makeStyles,
  WithStyles,
  withStyles,
  TableBody,
  Tooltip,
  Chip,
} from "@material-ui/core";
import { useHighlightedRowStyles } from "../../utils/styles";
import { OrderType } from "../../models/order";

interface TradeHistoryItemProps
  extends WithStyles<typeof useHighlightedRowStyles> {
  tradeHistory: TradeHistoryModel;
  onRowClick: () => void;
}

interface State {
  highlighted: boolean;
}

const TradeHistoryItem = withStyles(useHighlightedRowStyles)(
  class extends React.Component<TradeHistoryItemProps> {
    private timer?: number;

    state: State = {
      highlighted: false,
    };

    componentDidMount() {
      this.toggleHighlighted();
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
      const { classes, tradeHistory } = this.props;

      const color =
        tradeHistory.type === OrderType.buy ? "primary" : "secondary";
      const rowClass = this.state.highlighted
        ? classes.highlightedNormal
        : classes.highlightedDefault;

      return (
        <TableRow className={rowClass}>
          <TableCell align="left">
            <Typography color={color} noWrap>
              {tradeHistory.date.toLocaleString()}
            </Typography>
          </TableCell>
          <TableCell align="left">
            <Tooltip
              title={`${tradeHistory.rate.toFixed(8)} 로 거래창 가격 채우기`}
              placement="right"
            >
              <Chip
                clickable
                label={tradeHistory.rate.toFixed(8)}
                color={color}
                size="small"
                onClick={this.props.onRowClick}
              />
            </Tooltip>
          </TableCell>
          <TableCell align="right">
            <Typography color={color}>
              {tradeHistory.amount.toFixed(8)}
            </Typography>
          </TableCell>
          <TableCell align="right">
            <Typography color={color}>
              {tradeHistory.total.toFixed(8)}
            </Typography>
          </TableCell>
        </TableRow>
      );
    }
  }
);

interface Props {
  tradeHistories: TradeHistoryModel[];
  currencyPair?: CurrencyPair;
  onPriceClick: (price: number) => void;
}

const useTradeHistoryStyles = makeStyles({
  container: {
    height: 360,
  },
});

const TradeHistory: React.FC<Props> = ({
  tradeHistories,
  currencyPair,
  onPriceClick,
}) => {
  const classes = useTradeHistoryStyles();

  return (
    <Card elevation={10}>
      <CardContent>
        <Typography variant="h5" component="h3">
          거래내역
        </Typography>
      </CardContent>
      <Divider />
      <TableContainer className={classes.container}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="left">체결일시</TableCell>
              <TableCell align="left">가격</TableCell>
              <TableCell align="right">
                수량({currencyPair?.currency_to.symbol || "..."})
              </TableCell>
              <TableCell align="right">
                총액({currencyPair?.currency_from.symbol || "..."})
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tradeHistories.map((tradeHistory) => (
              <TradeHistoryItem
                key={tradeHistory.globalTradeID}
                tradeHistory={tradeHistory}
                onRowClick={() => onPriceClick(tradeHistory.rate)}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default TradeHistory;
