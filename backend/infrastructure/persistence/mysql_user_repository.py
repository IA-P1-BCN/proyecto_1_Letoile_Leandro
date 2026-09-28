from backend.domain.user import User
from backend.infrastructure.persistence.mysql_connection import (
    get_connection,
)
from backend.infrastructure.persistence.user_repository_interface import (
    UserRepositoryInterface,
)


class MySQLUserRepository(UserRepositoryInterface):

    def get_by_username(self, username: str) -> User | None:
        connection = get_connection()

        if connection is None:
            raise RuntimeError(
                "No se pudo conectar con MySQL"
            )

        cursor = connection.cursor()

        query = """
            SELECT
                user_id,
                username,
                password_hash,
                role
            FROM users
            WHERE username = %s
            LIMIT 1
        """

        try:
            cursor.execute(query, (username,))

            row = cursor.fetchone()

            if row is None:
                return None

            return User(
                user_id=int(row[0]),
                username=str(row[1]),
                password_hash=str(row[2]),
                role=str(row[3]),
            )

        finally:
            cursor.close()
            connection.close()