from abc import ABC, abstractmethod

from backend.domain.ride_record import RideRecord


class RideRepositoryInterface(ABC):
    """Contrato para los repositorios de carreras."""

    @abstractmethod
    def save(self, ride_record: RideRecord) -> int | None:
        """Guarda una carrera y devuelve su ID."""
        pass

    @abstractmethod
    def get_all(self) -> list[RideRecord]:
        """Devuelve todas las carreras almacenadas."""
        pass