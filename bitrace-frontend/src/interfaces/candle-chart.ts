export interface ICandleChart {
  anchor_datetime: Date;
  price_high: number;
  price_low: number;
  price_open: number;
  price_close: number;
  volume_base: number;
  volume_quote: number;
  price_average: number;
}