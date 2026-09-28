from abc import ABC, abstractmethod

from backend.domain.user import User


class UserRepositoryInterface(ABC):

    """Contrato para los repositorios de usuarios."""

    @abstractmethod
    def get_by_username(self, username: str) -> User | None:
        """Busca un usuario por su nombre de usuario."""
        pass