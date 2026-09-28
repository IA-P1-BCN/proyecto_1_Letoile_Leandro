import bcrypt

from backend.domain.user import User
from backend.infrastructure.persistence.mysql_user_repository import (
    MySQLUserRepository,
)
from backend.infrastructure.persistence.user_repository_interface import (
    UserRepositoryInterface,
)


class AuthService:

    def __init__(
        self,
        user_repository: UserRepositoryInterface | None = None,
    ):
        self.user_repository = (
            user_repository or MySQLUserRepository()
        )

    def authenticate(
        self,
        username: str,
        password: str,
    ) -> User | None:

        user = self.user_repository.get_by_username(
            username
        )

        if user is None:
            return None

        password_bytes = password.encode("utf-8")
        password_hash = user.password_hash.encode("utf-8")

        if not bcrypt.checkpw(
            password_bytes,
            password_hash,
        ):
            return None

        return user