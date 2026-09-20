from dataclasses import asdict, dataclass
from datetime import datetime
from typing import Any


@dataclass
class RideRecord:
    ride_id: int
    started_at: str
    finished_at: str
    stopped_time: float
    moving_time: float
    stopped_cost: float
    moving_cost: float
    total: float

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "RideRecord":
        return cls(
            ride_id=int(data["ride_id"]),
            started_at=str(data["started_at"]),
            finished_at=str(data["finished_at"]),
            stopped_time=float(data["stopped_time"]),
            moving_time=float(data["moving_time"]),
            stopped_cost=float(data["stopped_cost"]),
            moving_cost=float(data["moving_cost"]),
            total=float(data["total"]),
        )