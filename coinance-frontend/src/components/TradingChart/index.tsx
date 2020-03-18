import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import * as React from "react";
import { Chart, ChartCanvas } from "react-financial-charts";
import { XAxis, YAxis } from "react-financial-charts/lib/axes";
import { CrossHairCursor, EdgeIndicator, MouseCoordinateX, MouseCoordinateY } from "react-financial-charts/lib/coordinates";
import { elderRay, ema } from "react-financial-charts/lib/indicator";
import { discontinuousTimeScaleProviderBuilder } from "react-financial-charts/lib/scale";
import { BarSeries, CandlestickSeries, ElderRaySeries, LineSeries } from "react-financial-charts/lib/series";
import { MovingAverageTooltip, OHLCTooltip, SingleValueTooltip } from "react-financial-charts/lib/tooltip";
import { withDeviceRatio } from "react-financial-charts/lib/utils";
import { lastVisibleItemBasedZoomAnchor } from "react-financial-charts/lib/utils/zoomBehavior";
import { CandleStick, ChartType } from "../../models/candle-chart";
import withSize from "../../utils/hoc/with-size";
import { observer } from "mobx-react";
import { Card, Button, CardActions, Typography, CardContent, ButtonGroup, Divider, Table, TableRow, TableBody, TableHead, TableCell, Chip, TableContainer } from "@material-ui/core";
import { CurrencyPair } from "../../models/currency-pair";
import { Skeleton } from "@material-ui/lab";
import { useTitleStyles } from "../../utils/styles";
import TrendingChip from "../common/TrendingChip";

const CHART_HEIGHT = 480;

interface CandleChartProps {
  readonly data: CandleStick[];
  readonly height: number;
  readonly width: number;
  readonly ratio: number;
}

@observer
class CandleChart extends React.Component<CandleChartProps> {

  private readonly margin = { left: 0, right: 108, top: 0, bottom: 24 };
  private readonly pricesDisplayFormat = format('.8f');
  private readonly xScaleProvider = discontinuousTimeScaleProviderBuilder()
    .inputDateAccessor((d: CandleStick) => d.date);

  public render() {

    const {
      data: initialData,
      height,
      ratio,
      width,
    } = this.props;

    const dateTimeFormat = '%d %b %H:%M';

    const ema5 = ema()
      .id(1)
      .options({ windowSize: 5 })
      .merge((d: any, c: any) => { d.ema5 = c; })
      .accessor((d: any) => d.ema5);

    const ema20 = ema()
      .id(2)
      .options({ windowSize: 20 })
      .merge((d: any, c: any) => { d.ema20 = c; })
      .accessor((d: any) => d.ema20);

    const ema60 = ema()
      .id(3)
      .options({ windowSize: 60 })
      .merge((d: any, c: any) => { d.ema60 = c; })
      .accessor((d: any) => d.ema60);

    const ema120 = ema()
      .id(4)
      .options({ windowSize: 120 })
      .merge((d: any, c: any) => { d.ema120 = c; })
      .accessor((d: any) => d.ema120);

    const ema240 = ema()
      .id(5)
      .options({ windowSize: 240 })
      .merge((d: any, c: any) => { d.ema240 = c; })
      .accessor((d: any) => d.ema240);

    const elder = elderRay();

    const calculatedData = elder(ema5(ema20(ema60(ema120(ema240(initialData))))));

    const { margin, xScaleProvider } = this;

    const {
      data,
      xScale,
      xAccessor,
      displayXAccessor,
    } = xScaleProvider(calculatedData);

    const start = xAccessor(data[data.length - 1]);
    const end = xAccessor(data[0]);
    const xExtents = [start, end];

    const gridHeight = height - margin.top - margin.bottom;

    const elderRayHeight = 100;
    const elderRayOrigin = (_: number, h: number) => [0, h - elderRayHeight];
    const barChartHeight = gridHeight / 4;
    const barChartOrigin = (_: number, h: number) => [0, h - barChartHeight - elderRayHeight];
    const chartHeight = gridHeight - elderRayHeight;

    const timeDisplayFormat = timeFormat(dateTimeFormat);

    setTimeout(() => console.log(initialData), 1000);

    return (
      <ChartCanvas
        height={height}
        ratio={ratio}
        width={width}
        margin={margin}
        data={data}
        displayXAccessor={displayXAccessor}
        seriesName="Data"
        xScale={xScale}
        xExtents={xExtents}
        xAccessor={xAccessor}
        zoomAnchor={lastVisibleItemBasedZoomAnchor}>
        <Chart
          id={2}
          height={barChartHeight}
          origin={barChartOrigin}
          yExtents={this.barChartExtents}>
          <BarSeries
            fill={this.openCloseColor}
            yAccessor={this.yBarSeries} />
        </Chart>
        <Chart
          id={3}
          height={chartHeight}
          yExtents={this.candleChartExtents}>
          <XAxis
            showGridLines
            showTickLabel={false} />
          <YAxis
            showGridLines
            tickFormat={this.pricesDisplayFormat} />
          <CandlestickSeries />
          <LineSeries yAccessor={ema5.accessor()} stroke={ema5.stroke()} />
          <LineSeries yAccessor={ema20.accessor()} stroke={ema20.stroke()} />
          <LineSeries yAccessor={ema60.accessor()} stroke={ema60.stroke()} />
          <LineSeries yAccessor={ema120.accessor()} stroke={ema120.stroke()} />
          <LineSeries yAccessor={ema240.accessor()} stroke={ema240.stroke()} />
          <MouseCoordinateY
            rectWidth={margin.right}
            displayFormat={this.pricesDisplayFormat} />
          <EdgeIndicator
            itemType="last"
            rectWidth={margin.right}
            fill={this.openCloseColor}
            lineStroke={this.openCloseColor}
            displayFormat={this.pricesDisplayFormat}
            yAccessor={this.yEdgeIndicator} />
          <MovingAverageTooltip
            origin={[8, 24]}
            options={[
              {
                yAccessor: ema5.accessor(),
                type: "EMA",
                stroke: ema5.stroke(),
                windowSize: ema5.options().windowSize,
              },
              {
                yAccessor: ema20.accessor(),
                type: "EMA",
                stroke: ema20.stroke(),
                windowSize: ema20.options().windowSize,
              },
              {
                yAccessor: ema60.accessor(),
                type: "EMA",
                stroke: ema60.stroke(),
                windowSize: ema60.options().windowSize,
              },
              {
                yAccessor: ema120.accessor(),
                type: "EMA",
                stroke: ema120.stroke(),
                windowSize: ema120.options().windowSize,
              },
              {
                yAccessor: ema240.accessor(),
                type: "EMA",
                stroke: ema240.stroke(),
                windowSize: ema240.options().windowSize,
              },
            ]}
          />

          <OHLCTooltip origin={[8, 16]} />
        </Chart>
        <Chart
          id={4}
          height={elderRayHeight}
          yExtents={[0, elder.accessor()]}
          origin={elderRayOrigin}
          padding={{ top: 8, bottom: 8 }}>
          <XAxis
            showGridLines
            gridLinesStroke="#e0e3eb" />
          <YAxis
            ticks={4}
            tickFormat={this.pricesDisplayFormat} />

          <MouseCoordinateX displayFormat={timeDisplayFormat} />
          <MouseCoordinateY rectWidth={margin.right} displayFormat={this.pricesDisplayFormat} />

          <ElderRaySeries yAccessor={elder.accessor()} />

          <SingleValueTooltip
            yAccessor={elder.accessor()}
            yLabel="Elder Ray"
            yDisplayFormat={(d: any) => `${this.pricesDisplayFormat(d.bullPower)}, ${this.pricesDisplayFormat(d.bearPower)}`}
            origin={[8, 16]} />

        </Chart>
        <CrossHairCursor />
      </ChartCanvas>
    );
  }

  private readonly barChartExtents = (data: CandleStick) => {
    return data.volume;
  }

  private readonly candleChartExtents = (data: CandleStick) => {
    return [data.high, data.low];
  }

  private readonly yBarSeries = (data: CandleStick) => {
    return data.volume;
  }

  private readonly yEdgeIndicator = (data: CandleStick) => {
    return data.close;
  }

  private readonly openCloseColor = (data: CandleStick) => {
    return data.close > data.open ? "#26a69a" : "#ef5350";
  }
}

const SizedCandleChart = withSize(CHART_HEIGHT)(withDeviceRatio()(CandleChart));

const SizedCandleChartSkeleton: React.FC = () => (
  <Skeleton variant="rect" height={CHART_HEIGHT} animation="wave" />
);

const ChartHeader: React.FC<{ currencyPair: CurrencyPair }> = props => {
  const { title } = useTitleStyles();

  return (
    <>
      <Typography className={title} variant="h3" component="h2">
        {props.currencyPair.currency_to.symbol}
      </Typography>
      <Typography variant="body2" color="textSecondary" component="h3">
        <b>{props.currencyPair.currency_to.name}</b> / {props.currencyPair.currency_from.name}
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

const ChartTypeButtons: React.FC<{ chartType: ChartType, setChartType: (chartType: ChartType) => void }> = props => (
  <ButtonGroup variant="text" area-label="chart types">
    <Button
      color={props.chartType === ChartType.full ? 'primary' : 'default'}
      onClick={() => props.setChartType(ChartType.full)}>
      전체
    </Button>
    <Button
      color={props.chartType === ChartType.yearly ? 'primary' : 'default'}
      onClick={() => props.setChartType(ChartType.yearly)}>
      1년
    </Button>
    <Button
      color={props.chartType === ChartType.monthly ? 'primary' : 'default'}
      onClick={() => props.setChartType(ChartType.monthly)}>
      1달
    </Button>
    <Button
      color={props.chartType === ChartType.weekly ? 'primary' : 'default'}
      onClick={() => props.setChartType(ChartType.weekly)}>
      1주
    </Button>
    <Button
      color={props.chartType === ChartType.daily ? 'primary' : 'default'}
      onClick={() => props.setChartType(ChartType.daily)}>
      1일
    </Button>
  </ButtonGroup>
);

const CurrencyPairInfo: React.FC<{ currencyPair: CurrencyPair }> = ({ currencyPair }) => {
  const lastTradePrice = currencyPair.exchange_rate.last_trade_price;
  const changeRate24h = Math.round(currencyPair.exchange_rate.change_rate_24h * 10000) / 100;
  const highestTradePrice24h = currencyPair.exchange_rate.highest_trade_price_24h;
  const lowestTradePrice24h = currencyPair.exchange_rate.lowest_trade_price_24h;
  const baseVolume24h = currencyPair.exchange_rate.base_volume_24h;
  const quoteVolume24h = currencyPair.exchange_rate.quote_volume_24h;
  const symbolFrom = currencyPair.currency_from.symbol;
  const symbolTo = currencyPair.currency_to.symbol;

  return (
    <TableContainer>
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
              <b>{lastTradePrice}</b> <Chip variant="outlined" size="small" label={symbolFrom} />
            </TableCell>
            <TableCell>
              <TrendingChip value={changeRate24h} />
            </TableCell>
            <TableCell>
              {highestTradePrice24h} <Chip variant="outlined" size="small" label={symbolFrom} />
            </TableCell>
            <TableCell>
              {lowestTradePrice24h} <Chip variant="outlined" size="small" label={symbolFrom} />
            </TableCell>
            <TableCell>
              {baseVolume24h} <Chip variant="outlined" size="small" label={symbolFrom} />
            </TableCell>
            <TableCell>
              {quoteVolume24h} <Chip variant="outlined" size="small" label={symbolTo} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

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
        <TableCell><Skeleton animation="wave" /></TableCell>
        <TableCell><Skeleton animation="wave" /></TableCell>
        <TableCell><Skeleton animation="wave" /></TableCell>
        <TableCell><Skeleton animation="wave" /></TableCell>
        <TableCell><Skeleton animation="wave" /></TableCell>
        <TableCell><Skeleton animation="wave" /></TableCell>
      </TableRow>
    </TableBody>
  </Table>
)

interface TradingChartProps {
  chartType: ChartType;
  chartData: CandleStick[];
  currencyPair?: CurrencyPair;
  setChartType: (chartType: ChartType) => void;
}

const TradingChart: React.FC<TradingChartProps> = props => {
  return (
    <Card elevation={0}>
      <CardContent>
        {!!props.currencyPair ? <ChartHeader currencyPair={props.currencyPair} /> : <ChartHeaderSkeleton />}
      </CardContent>
      <Divider />
      {!!props.currencyPair ? <CurrencyPairInfo currencyPair={props.currencyPair} /> : <CurrencyPairInfoSkeleton />}
      <CardActions>
        <ChartTypeButtons chartType={props.chartType} setChartType={props.setChartType} />
      </CardActions>
      <CardContent>
        {props.chartData.length !== 0 ? <SizedCandleChart data={props.chartData} /> : <SizedCandleChartSkeleton />}
      </CardContent>
    </Card>
  );
}

export default TradingChart;
