from domain.state import TaxiState


class Taxi:
    def __init__(self):
        self.state = TaxiState.IDLE

    def start(self):
        self.state = TaxiState.STOPPED

    def move(self):
        self.state = TaxiState.MOVING

    def stop(self):
        self.state = TaxiState.STOPPED

    def finish(self):
        self.state = TaxiState.FINISHED