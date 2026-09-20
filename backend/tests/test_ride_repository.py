import json
import tempfile
import unittest
from pathlib import Path

from backend.domain.ride_record import RideRecord
from backend.infrastructure.persistence.ride_repository import RideRepository


class TestRideRepository(unittest.TestCase):

    def test_creates_empty_file(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            file_path = Path(temp_dir) / "rides.json"

            RideRepository(file_path)

            self.assertTrue(file_path.exists())

            data = json.loads(
                file_path.read_text(encoding="utf-8")
            )

            self.assertEqual(data, [])

    def test_save_ride(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            file_path = Path(temp_dir) / "rides.json"

            repository = RideRepository(file_path)

            ride = RideRecord(
                ride_id=1,
                started_at="2026-09-20T21:00:00",
                finished_at="2026-09-20T21:10:00",
                stopped_time=100.0,
                moving_time=500.0,
                stopped_cost=2.0,
                moving_cost=25.0,
                total=27.0,
            )

            repository.save(ride)

            data = json.loads(
                file_path.read_text(encoding="utf-8")
            )

            self.assertEqual(len(data), 1)
            self.assertEqual(data[0]["ride_id"], 1)
            self.assertEqual(data[0]["total"], 27.0)

    def test_get_all_rides(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            file_path = Path(temp_dir) / "rides.json"

            repository = RideRepository(file_path)

            ride_1 = RideRecord(
                ride_id=1,
                started_at="2026-09-20T21:00:00",
                finished_at="2026-09-20T21:10:00",
                stopped_time=100.0,
                moving_time=500.0,
                stopped_cost=2.0,
                moving_cost=25.0,
                total=27.0,
            )

            ride_2 = RideRecord(
                ride_id=2,
                started_at="2026-09-20T21:15:00",
                finished_at="2026-09-20T21:20:00",
                stopped_time=60.0,
                moving_time=240.0,
                stopped_cost=1.2,
                moving_cost=12.0,
                total=13.2,
            )

            repository.save(ride_1)
            repository.save(ride_2)

            rides = repository.get_all()

            self.assertEqual(len(rides), 2)

            self.assertEqual(rides[0].ride_id, 1)
            self.assertEqual(rides[0].total, 27.0)

            self.assertEqual(rides[1].ride_id, 2)
            self.assertEqual(rides[1].total, 13.2)

    def test_get_all_returns_ride_records(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            file_path = Path(temp_dir) / "rides.json"

            repository = RideRepository(file_path)

            ride = RideRecord(
                ride_id=1,
                started_at="2026-09-20T21:00:00",
                finished_at="2026-09-20T21:10:00",
                stopped_time=100.0,
                moving_time=500.0,
                stopped_cost=2.0,
                moving_cost=25.0,
                total=27.0,
            )

            repository.save(ride)

            rides = repository.get_all()

            self.assertIsInstance(rides[0], RideRecord)


if __name__ == "__main__":
    unittest.main()