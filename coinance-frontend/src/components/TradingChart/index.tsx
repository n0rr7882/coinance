import * as React from "react";
import Chart from "kaktana-react-lightweight-charts";
import { CandleStick, ChartType } from "../../models/candle-chart";
import { observer } from "mobx-react";
import {
  Card,
  Button,
  CardActions,
  Typography,
  CardContent,
  ButtonGroup,
  Divider,
  Table,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  useTheme,
} from "@material-ui/core";
import { CurrencyPair } from "../../models/currency-pair";
import { Skeleton } from "@material-ui/lab";
import { useTitleStyles } from "../../utils/styles";
import TrendingChip from "../common/TrendingChip";
import { Status, IErrorData } from "../../models/common";
import { AxiosError } from "axios";
import ErrorAlert from "../common/ErrorAlert";
import { toTimestamp } from "../../utils/timestamp";

const CHART_HEIGHT = 380;

interface CandleChartsProps {
  readonly data: CandleStick[];
}

const SizedCandleChartSkeleton: React.FC = () => (
  <Skeleton variant="rect" height={CHART_HEIGHT} animation="wave" />
);

const ChartHeader: React.FC<{ currencyPair: CurrencyPair }> = (props) => {
  const { title } = useTitleStyles();

  return (
    <>
      <Typography className={title} variant="h3" component="h2">
        {props.currencyPair.currency_to.symbol}/
        {props.currencyPair.currency_from.symbol}
      </Typography>
      <Typography variant="body2" color="textSecondary" component="h3">
        <b>{props.currencyPair.currency_to.name}</b> /{" "}
        {props.currencyPair.currency_from.name}
      </Typography>
    </>
  );
};

const ChartHeaderSkeleton: React.FC = () => (
  <>
    <Skeleton variant="rect" height={56} animation="wave" />
    <Skeleton animation="wave" />
  </>
);

const ChartTypeButtons: React.FC<{
  chartType: ChartType;
  setChartType: (chartType: ChartType) => void;
}> = (props) => (
  <ButtonGroup variant="text" area-label="chart types">
    <Button
      color={props.chartType === ChartType.full ? "primary" : "default"}
      onClick={() => props.setChartType(ChartType.full)}
    >
      전체
    </Button>
    <Button
      color={props.chartType === ChartType.yearly ? "primary" : "default"}
      onClick={() => props.setChartType(ChartType.yearly)}
    >
      1년
    </Button>
    <Button
      color={props.chartType === ChartType.monthly ? "primary" : "default"}
      onClick={() => props.setChartType(ChartType.monthly)}
    >
      1달
    </Button>
    <Button
      color={props.chartType === ChartType.weekly ? "primary" : "default"}
      onClick={() => props.setChartType(ChartType.weekly)}
    >
      1주
    </Button>
    <Button
      color={props.chartType === ChartType.daily ? "primary" : "default"}
      onClick={() => props.setChartType(ChartType.daily)}
    >
      1일
    </Button>
  </ButtonGroup>
);

const CurrencyPairInfo: React.FC<{ currencyPair: CurrencyPair }> = observer(
  ({ currencyPair }) => {
    const lastTradePrice = currencyPair.exchange_rate.last_trade_price;
    const changeRate24h =
      Math.round(currencyPair.exchange_rate.change_rate_24h * 10000) / 100;
    const highestTradePrice24h =
      currencyPair.exchange_rate.highest_trade_price_24h;
    const lowestTradePrice24h =
      currencyPair.exchange_rate.lowest_trade_price_24h;
    const baseVolume24h = currencyPair.exchange_rate.base_volume_24h;
    const quoteVolume24h = currencyPair.exchange_rate.quote_volume_24h;

    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="right">현재가</TableCell>
              <TableCell>전일대비(%)</TableCell>
              <TableCell align="right">고가(24H)</TableCell>
              <TableCell align="right">저가(24H)</TableCell>
              <TableCell align="right">거래량(24H)</TableCell>
              <TableCell align="right">거래대금(24H)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell align="right">
                <b>{lastTradePrice.toFixed(8)}</b>
              </TableCell>
              <TableCell>
                <TrendingChip value={changeRate24h} />
              </TableCell>
              <TableCell align="right">
                {highestTradePrice24h.toFixed(8)}
              </TableCell>
              <TableCell align="right">
                {lowestTradePrice24h.toFixed(8)}
              </TableCell>
              <TableCell align="right">{baseVolume24h.toFixed(8)}</TableCell>
              <TableCell align="right">{quoteVolume24h.toFixed(8)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
);

const CurrencyPairInfoSkeleton: React.FC = () => (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>현재가</TableCell>
        <TableCell>전일대비(%)</TableCell>
        <TableCell>고가(24H)</TableCell>
        <TableCell>저가(24H)</TableCell>
        <TableCell>거래량(24H)</TableCell>
        <TableCell>거래대금(24H)</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>
          <Skeleton animation="wave" />
        </TableCell>
        <TableCell>
          <Skeleton animation="wave" />
        </TableCell>
        <TableCell>
          <Skeleton animation="wave" />
        </TableCell>
        <TableCell>
          <Skeleton animation="wave" />
        </TableCell>
        <TableCell>
          <Skeleton animation="wave" />
        </TableCell>
        <TableCell>
          <Skeleton animation="wave" />
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

const CandleCharts: React.FC<CandleChartsProps> = observer(({ data }) => {
  const theme = useTheme();

  const chartOptions = {
    layout: {
      backgroundColor: theme.palette.background.paper,
      textColor: theme.palette.text.primary,
    },
    timeScale: {
      borderColor: theme.palette.background.default,
      timeVisible: true,
      secondsVisible: false,
    },
    priceScale: {
      borderColor: theme.palette.background.default,
    },
    grid: {
      vertLines: {
        color: theme.palette.background.default,
      },
      horzLines: {
        color: theme.palette.background.default,
      },
    },
    crosshair: {
      vertLine: {
        color: theme.palette.type === 'dark' ? theme.palette.common.white : theme.palette.common.black,
      },
      horzLine: {
        color: theme.palette.type === 'dark' ? theme.palette.common.white : theme.palette.common.black,
      },
      mode: 1,
    },
  };
  const candlestickSeries = {
    upColor: theme.palette.primary.main,
    downColor: theme.palette.secondary.main,
    wickUpColor: theme.palette.primary.main,
    wickDownColor: theme.palette.secondary.main,
    data: data.map(({ date, open, high, low, close }) => ({
      time: toTimestamp(date),
      open,
      high,
      low,
      close,
    })),
  };

  return (
    <Chart
      autoWidth
      darkTheme={theme.palette.type === "dark"}
      height={CHART_HEIGHT}
      options={chartOptions}
      candlestickSeries={[candlestickSeries]}
    />
  );
});

interface TradingChartProps {
  status: Status;
  errors?: AxiosError<IErrorData>;
  chartType: ChartType;
  chartData: CandleStick[];
  currencyPair?: CurrencyPair;
  setChartType: (chartType: ChartType) => void;
}

const TradingChart: React.FC<TradingChartProps> = observer((props) => (
  <Card elevation={10}>
    <ErrorAlert open={props.status === Status.error} errors={props.errors} />
    <CardContent>
      {!props.currencyPair || props.status === Status.pending ? (
        <ChartHeaderSkeleton />
      ) : (
        <ChartHeader currencyPair={props.currencyPair} />
      )}
    </CardContent>
    <Divider />
    <CardActions>
      <ChartTypeButtons
        chartType={props.chartType}
        setChartType={props.setChartType}
      />
    </CardActions>
    <CardContent>
      {props.chartData.length !== 0 ? (
        <div>
          <CandleCharts data={props.chartData} />
        </div>
      ) : (
        <SizedCandleChartSkeleton />
      )}
    </CardContent>
    <Divider />
    {!props.currencyPair || props.status === Status.pending ? (
      <CurrencyPairInfoSkeleton />
    ) : (
      <CurrencyPairInfo currencyPair={props.currencyPair} />
    )}
  </Card>
));

export default TradingChart;
