from enum import Enum


class TaxiState(Enum):
    IDLE = "idle"
    STOPPED = "stopped"
    MOVING = "moving"
    FINISHED = "finished"