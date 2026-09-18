from backend.domain.ride import Ride
from backend.domain.state import TaxiState


RATE_STOPPED = 0.02
RATE_MOVING = 0.05


class Taximeter:

    def __init__(self):
        self.ride = None

    def start(self):
        if self.ride is not None:
            return False, "⚠️ Ya hay una carrera en curso"

        self.ride = Ride()
        self.ride.start()

        return True, "🚕 Carrera iniciada"

    def move(self):
        if self.ride is None:
            return False, "⚠️ No hay ninguna carrera en curso"

        if self.ride.taxi.state == TaxiState.MOVING:
            return False, "⚠️ El taxi ya está en movimiento"

        self.ride.move()

        return True, "🚗 Estado: en movimiento"

    def stop(self):
        if self.ride is None:
            return False, "⚠️ No hay ninguna carrera en curso"

        if self.ride.taxi.state == TaxiState.STOPPED:
            return False, "⚠️ El taxi ya está detenido"

        self.ride.stop()

        return True, "🛑 Estado: detenido"

    def finish(self):
        if self.ride is None:
            return False, "⚠️ No hay ninguna carrera en curso"

        times = self.ride.finish()

        stopped_cost = times["stopped_time"] * RATE_STOPPED
        moving_cost = times["moving_time"] * RATE_MOVING
        total = stopped_cost + moving_cost

        result = {
            "stopped_time": times["stopped_time"],
            "moving_time": times["moving_time"],
            "stopped_cost": stopped_cost,
            "moving_cost": moving_cost,
            "total": total,
        }

        self.ride = None

        return True, result

    def get_state(self):
        if self.ride is None:
            return TaxiState.IDLE.value

        return self.ride.taxi.state.value