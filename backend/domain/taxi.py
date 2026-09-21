from backend.domain.state import TaxiState


class Taxi:

    def __init__(self):
        self.state = TaxiState.IDLE

    def start(self):
        if self.state != TaxiState.IDLE:
            return False

        self.state = TaxiState.STOPPED

        return True

    def move(self):
        if self.state != TaxiState.STOPPED:
            return False

        self.state = TaxiState.MOVING

        return True

    def stop(self):
        if self.state != TaxiState.MOVING:
            return False

        self.state = TaxiState.STOPPED

        return True

    def finish(self):
        if self.state not in (
            TaxiState.STOPPED,
            TaxiState.MOVING
        ):
            return False

        self.state = TaxiState.FINISHED

        return True