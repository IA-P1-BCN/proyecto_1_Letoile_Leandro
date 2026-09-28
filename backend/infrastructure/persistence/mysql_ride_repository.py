from datetime import datetime

from backend.domain.ride_record import RideRecord
from backend.infrastructure.persistence.mysql_connection import (
    get_connection,
)
from backend.infrastructure.persistence.ride_repository_interface import (
    RideRepositoryInterface,
)


class MySQLRideRepository(RideRepositoryInterface):

    def save(self, ride_record):
        connection = get_connection()

        if connection is None:
            raise RuntimeError(
                "No se pudo conectar con MySQL"
            )

        cursor = connection.cursor()

        query = """
            INSERT INTO rides (
                started_at,
                finished_at,
                stopped_time,
                moving_time,
                stopped_cost,
                moving_cost,
                total
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """

        started_at = datetime.fromisoformat(
            ride_record.started_at
        )

        finished_at = datetime.fromisoformat(
            ride_record.finished_at
        )

        values = (
            started_at,
            finished_at,
            ride_record.stopped_time,
            ride_record.moving_time,
            ride_record.stopped_cost,
            ride_record.moving_cost,
            ride_record.total,
        )

        try:
            cursor.execute(query, values)
            connection.commit()

            return cursor.lastrowid

        finally:
            cursor.close()
            connection.close()

    def get_all(self):
        connection = get_connection()

        if connection is None:
            raise RuntimeError(
                "No se pudo conectar con MySQL"
            )

        cursor = connection.cursor()

        query = """
            SELECT
                ride_id,
                started_at,
                finished_at,
                stopped_time,
                moving_time,
                stopped_cost,
                moving_cost,
                total
            FROM rides
            ORDER BY ride_id
        """

        try:
            cursor.execute(query)

            rows = cursor.fetchall()

            return [
                self._row_to_ride_record(row)
                for row in rows
            ]

        finally:
            cursor.close()
            connection.close()

    def _row_to_ride_record(self, row):
        return RideRecord(
            ride_id=int(row[0]),
            started_at=row[1].isoformat(),
            finished_at=row[2].isoformat(),
            stopped_time=float(row[3]),
            moving_time=float(row[4]),
            stopped_cost=float(row[5]),
            moving_cost=float(row[6]),
            total=float(row[7]),
        )