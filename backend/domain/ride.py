import time
from datetime import datetime

from backend.domain.state import TaxiState
from backend.domain.taxi import Taxi


class Ride:
    def __init__(self):
        self.taxi = Taxi()
        self.started = False

        self.started_at = None
        self.finished_at = None

        self.state_start_time = None

        self.stopped_time = 0.0
        self.moving_time = 0.0

    def start(self):
        if self.started:
            return False

        self.taxi.start()

        self.started = True
        self.started_at = datetime.now().isoformat()
        self.finished_at = None

        self.state_start_time = time.time()

        return True

    def move(self):
        if not self.started:
            return False

        if self.taxi.state == TaxiState.MOVING:
            return False

        current_time = time.time()

        self.stopped_time += (
            current_time - self.state_start_time
        )

        self.taxi.move()
        self.state_start_time = current_time

        return True

    def stop(self):
        if not self.started:
            return False

        if self.taxi.state == TaxiState.STOPPED:
            return False

        current_time = time.time()

        self.moving_time += (
            current_time - self.state_start_time
        )

        self.taxi.stop()
        self.state_start_time = current_time

        return True

    def finish(self):
        if not self.started:
            return None

        current_time = time.time()

        elapsed = current_time - self.state_start_time

        if self.taxi.state == TaxiState.MOVING:
            self.moving_time += elapsed

        elif self.taxi.state == TaxiState.STOPPED:
            self.stopped_time += elapsed

        self.finished_at = datetime.now().isoformat()

        self.taxi.finish()

        self.started = False
        self.state_start_time = None

        return {
            "started_at": self.started_at,
            "finished_at": self.finished_at,
            "stopped_time": self.stopped_time,
            "moving_time": self.moving_time,
        }