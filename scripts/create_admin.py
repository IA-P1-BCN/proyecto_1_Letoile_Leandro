import getpass
import os

import bcrypt
import mysql.connector


def get_database_connection():
    return mysql.connector.connect(
        host=os.getenv("MYSQL_HOST", "mysql"),
        port=int(os.getenv("MYSQL_PORT", "3306")),
        user=os.getenv("MYSQL_USER", "root"),
        password=os.getenv("MYSQL_PASSWORD"),
        database=os.getenv("MYSQL_DATABASE", "taxitech"),
    )


def main():
    print()
    print("===================================")
    print(" TaxiTech - Crear usuario admin")
    print("===================================")
    print()

    username = input("Nombre de usuario: ").strip()

    if not username:
        print("Error: el nombre de usuario no puede estar vacío.")
        return

    password = getpass.getpass("Contraseña: ")
    password_confirmation = getpass.getpass(
        "Repetir contraseña: "
    )

    if not password:
        print("Error: la contraseña no puede estar vacía.")
        return

    if password != password_confirmation:
        print("Error: las contraseñas no coinciden.")
        return

    connection = None
    cursor = None

    try:
        connection = get_database_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT user_id
            FROM users
            WHERE username = %s
            LIMIT 1
            """,
            (username,),
        )

        existing_user = cursor.fetchone()

        if existing_user is not None:
            print()
            print(
                f"Error: el usuario '{username}' ya existe."
            )
            return

        password_hash = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt(),
        ).decode("utf-8")

        cursor.execute(
            """
            INSERT INTO users (
                username,
                password_hash,
                role
            )
            VALUES (%s, %s, %s)
            """,
            (
                username,
                password_hash,
                "admin",
            ),
        )

        connection.commit()

        print()
        print(
            f"Usuario '{username}' creado correctamente."
        )
        print("Rol: admin")
        print()

    except mysql.connector.Error as error:
        if connection is not None:
            connection.rollback()

        print()
        print("Error al acceder a MySQL:")
        print(error)

    finally:
        if cursor is not None:
            cursor.close()

        if connection is not None:
            connection.close()


if __name__ == "__main__":
    main()