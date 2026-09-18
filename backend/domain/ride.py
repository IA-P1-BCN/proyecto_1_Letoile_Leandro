import time

from backend.domain.taxi import Taxi
from backend.domain.state import TaxiState


class Ride:

    def __init__(self):
        self.taxi = Taxi()
        self.started = False
        self.state_start_time = None
        self.stopped_time = 0
        self.moving_time = 0

    def start(self):
        self.started = True
        self.taxi.start()
        self.state_start_time = time.time()

    def move(self):
        current_time = time.time()

        self.stopped_time += current_time - self.state_start_time

        self.taxi.move()
        self.state_start_time = current_time

    def stop(self):
        current_time = time.time()

        self.moving_time += current_time - self.state_start_time

        self.taxi.stop()
        self.state_start_time = current_time

    def finish(self):
        current_time = time.time()

        if self.taxi.state == TaxiState.MOVING:
            self.moving_time += current_time - self.state_start_time
        else:
            self.stopped_time += current_time - self.state_start_time

        self.taxi.finish()
        self.started = False
        self.state_start_time = None

        return {
            "stopped_time": self.stopped_time,
            "moving_time": self.moving_time,
        }