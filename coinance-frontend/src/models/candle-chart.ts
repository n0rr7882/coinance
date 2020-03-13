import { fromTimestamp } from "../utils/timestamp";

export enum ChartType {
  full = 'full',
  yearly = 'yearly',
  monthly = 'monthly',
  weekly = 'weekly',
  daily = 'daily',
}

export enum ChartPeriod {
  hours24 = 86400,
  hours4 = 14400,
  hours2 = 7200,
  minutes30 = 1800,
  minutes15 = 900,
  minutes5 = 300,
}

export class ChartOption {
  public command: string;
  public currencyPair?: string;
  public period: ChartPeriod;
  public start: number;
  public end: number;

  constructor(period: ChartPeriod, start: number, end: number) {
    this.command = 'returnChartData';
    this.currencyPair = undefined;
    this.period = period;
    this.start = start;
    this.end = end;
  }
}

export class CandleStick {
  public readonly date: Date;
  public readonly high: number;
  public readonly low: number;
  public readonly open: number;
  public readonly close: number;
  public readonly volume: number;
  public readonly quoteVolume: number;
  public readonly weightedAverage: number;

  constructor(data: CandleStick) {
    this.date = fromTimestamp(Number(data.date));
    this.high = data.high;
    this.low = data.low;
    this.open = data.open;
    this.close = data.close;
    this.volume = data.volume;
    this.quoteVolume = data.quoteVolume;
    this.weightedAverage = data.weightedAverage;
  }
}