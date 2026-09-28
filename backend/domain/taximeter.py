from backend.domain.ride import Ride
from backend.domain.ride_record import RideRecord
from backend.domain.state import TaxiState
from backend.infrastructure.config.tariff_config import TariffConfig
from backend.infrastructure.logging.logger import TaximeterLogger
from backend.infrastructure.persistence.mysql_ride_repository import (
    MySQLRideRepository,
)


class Taximeter:

    def __init__(
        self,
        tariff_config=None,
        ride_repository=None,
        logger=None
    ):
        self.ride = None

        self.tariff_config = (
            tariff_config or TariffConfig()
        )

        self.ride_repository = (
            ride_repository or MySQLRideRepository()
        )

        self.logger = (
            logger or TaximeterLogger()
        )

    def start(self):
        if self.ride is not None:
            self.logger.warning(
                "Intento de iniciar una carrera mientras otra está en curso"
            )

            return False, "Ya hay una carrera en curso"

        ride = Ride()

        if not ride.start():
            self.logger.error(
                "No se pudo iniciar la nueva carrera"
            )

            return False, "No se pudo iniciar la carrera"

        self.ride = ride

        self.logger.info(
            "Carrera iniciada"
        )

        return True, "Carrera iniciada"

    def move(self):
        if self.ride is None:
            self.logger.error(
                "Intento de mover el taxi sin una carrera en curso"
            )

            return False, "No hay ninguna carrera en curso"

        if self.ride.taxi.state == TaxiState.MOVING:
            self.logger.warning(
                "Intento de mover el taxi cuando ya está en movimiento"
            )

            return False, "El taxi ya está en movimiento"

        if not self.ride.move():
            self.logger.warning(
                "Intento de mover el taxi en un estado no válido"
            )

            return False, "No se puede mover el taxi en su estado actual"

        self.logger.info(
            "Taxi en movimiento"
        )

        return True, "Estado: en movimiento"

    def stop(self):
        if self.ride is None:
            self.logger.error(
                "Intento de detener el taxi sin una carrera en curso"
            )

            return False, "No hay ninguna carrera en curso"

        if self.ride.taxi.state == TaxiState.STOPPED:
            self.logger.warning(
                "Intento de detener el taxi cuando ya está detenido"
            )

            return False, "El taxi ya está detenido"

        if not self.ride.stop():
            self.logger.warning(
                "Intento de detener el taxi en un estado no válido"
            )

            return False, "No se puede detener el taxi en su estado actual"

        self.logger.info(
            "Taxi detenido"
        )

        return True, "Estado: detenido"

    def get_current(self):
        if self.ride is None:
            return {
                "state": TaxiState.IDLE.value,
                "stopped_time": 0.0,
                "moving_time": 0.0,
                "stopped_cost": 0.0,
                "moving_cost": 0.0,
                "total": 0.0,
            }

        times = self.ride.get_current_times()

        stopped_cost = (
            times["stopped_time"]
            * self.tariff_config.stopped_rate
        )

        moving_cost = (
            times["moving_time"]
            * self.tariff_config.moving_rate
        )

        total = stopped_cost + moving_cost

        return {
            "state": self.ride.taxi.state.value,
            "stopped_time": times["stopped_time"],
            "moving_time": times["moving_time"],
            "stopped_cost": stopped_cost,
            "moving_cost": moving_cost,
            "total": total,
        }

    def finish(self):
        if self.ride is None:
            self.logger.error(
                "Intento de finalizar una carrera inexistente"
            )

            return False, "No hay ninguna carrera en curso"

        times = self.ride.finish()

        if times is None:
            self.logger.warning(
                "Intento de finalizar la carrera en un estado no válido"
            )

            return False, "No se puede finalizar la carrera en su estado actual"

        stopped_cost = (
            times["stopped_time"]
            * self.tariff_config.stopped_rate
        )

        moving_cost = (
            times["moving_time"]
            * self.tariff_config.moving_rate
        )

        total = stopped_cost + moving_cost

        ride_id = self._get_next_ride_id()

        ride_record = RideRecord(
            ride_id=ride_id,
            started_at=times["started_at"],
            finished_at=times["finished_at"],
            stopped_time=times["stopped_time"],
            moving_time=times["moving_time"],
            stopped_cost=stopped_cost,
            moving_cost=moving_cost,
            total=total,
        )

        generated_id = self.ride_repository.save(
            ride_record
        )

        if generated_id is not None:
            ride_record.ride_id = generated_id

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

        self.logger.info(
            f"Carrera finalizada - "
            f"ride_id={ride_record.ride_id} - "
            f"total={ride_record.total:.2f} EUR"
        )

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