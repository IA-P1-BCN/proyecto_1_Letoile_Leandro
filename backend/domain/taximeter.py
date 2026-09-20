from backend.domain.ride import Ride
from backend.domain.ride_record import RideRecord
from backend.domain.state import TaxiState
from backend.infrastructure.config.tariff_config import TariffConfig
from backend.infrastructure.persistence.ride_repository import RideRepository


class Taximeter:

    def __init__(
        self,
        tariff_config=None,
        ride_repository=None
    ):
        self.ride = None

        self.tariff_config = (
            tariff_config or TariffConfig()
        )

        self.ride_repository = (
            ride_repository or RideRepository()
        )

    def start(self):
        if self.ride is not None:
            return False, "Ya hay una carrera en curso"

        self.ride = Ride()
        self.ride.start()

        return True, "Carrera iniciada"

    def move(self):
        if self.ride is None:
            return False, "No hay ninguna carrera en curso"

        if self.ride.taxi.state == TaxiState.MOVING:
            return False, "El taxi ya está en movimiento"

        self.ride.move()

        return True, "Estado: en movimiento"

    def stop(self):
        if self.ride is None:
            return False, "No hay ninguna carrera en curso"

        if self.ride.taxi.state == TaxiState.STOPPED:
            return False, "El taxi ya está detenido"

        self.ride.stop()

        return True, "Estado: detenido"

    def finish(self):
        if self.ride is None:
            return False, "No hay ninguna carrera en curso"

        times = self.ride.finish()

        stopped_cost = (
            times["stopped_time"]
            * self.tariff_config.stopped_rate
        )

        moving_cost = (
            times["moving_time"]
            * self.tariff_config.moving_rate
        )

        total = stopped_cost + moving_cost

        ride_record = RideRecord(
            ride_id=self._get_next_ride_id(),
            started_at=times["started_at"],
            finished_at=times["finished_at"],
            stopped_time=times["stopped_time"],
            moving_time=times["moving_time"],
            stopped_cost=stopped_cost,
            moving_cost=moving_cost,
            total=total,
        )

        self.ride_repository.save(ride_record)

        result = {
            "ride_id": ride_record.ride_id,
            "started_at": ride_record.started_at,
            "finished_at": ride_record.finished_at,
            "stopped_time": ride_record.stopped_time,
            "moving_time": ride_record.moving_time,
            "stopped_cost": ride_record.stopped_cost,
            "moving_cost": ride_record.moving_cost,
            "total": ride_record.total,
        }

        self.ride = None

        return True, result

    def get_state(self):
        if self.ride is None:
            return TaxiState.IDLE.value

        return self.ride.taxi.state.value

    def get_history(self):
        return self.ride_repository.get_all()

    def _get_next_ride_id(self):
        rides = self.ride_repository.get_all()

        if not rides:
            return 1

        return max(
            ride.ride_id
            for ride in rides
        ) + 1