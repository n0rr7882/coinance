from dataclasses import dataclass, asdict
from datetime import datetime


@dataclass
class CandleChartData:
    anchor_datetime: datetime
    price_high: float
    price_low: float
    price_open: float
    price_close: float
    volume_base: float
    volume_quote: float
    price_average: float

    @classmethod
    def from_raw(cls, raw: dict) -> 'CandleChartData':
        return cls(
            anchor_datetime=datetime.fromtimestamp(raw['date']),
            price_high=raw['high'],
            price_low=raw['low'],
            price_open=raw['open'],
            price_close=raw['close'],
            volume_base=raw['volume'],
            volume_quote=raw['quoteVolume'],
            price_average=raw['weightedAverage'],
        )

    def serialize(self) -> str:
        return asdict(self)
