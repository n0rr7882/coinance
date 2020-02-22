import json
from dataclasses import dataclass, asdict


@dataclass
class TickerData:
    currency_pair_id: int
    last_trade_price: float
    lowest_ask: float
    highest_bid: float
    change_rate_24h: float
    base_volume_24h: float
    quote_volume_24h: float
    market_active: bool
    highest_trade_price_24h: float
    lowest_trade_price_24h: float

    @classmethod
    def from_raw(cls, raw: list) -> 'TickerData':
        return cls(
            currency_pair_id=raw[0],
            last_trade_price=float(raw[1]),
            lowest_ask=float(raw[2]),
            highest_bid=float(raw[3]),
            change_rate_24h=float(raw[4]),
            base_volume_24h=float(raw[5]),
            quote_volume_24h=float(raw[6]),
            market_active=raw[7] == 0,
            highest_trade_price_24h=float(raw[8]),
            lowest_trade_price_24h=float(raw[9]),
        )

    def serialize(self) -> str:
        return json.dumps(asdict(self))

    @classmethod
    def deserialize(cls, serialized: str) -> 'TickerData':
        return cls(**json.loads(serialized))
