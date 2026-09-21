import tempfile
import unittest
from pathlib import Path

from fastapi.testclient import TestClient

from backend.application.taximeter_service import TaximeterService
from backend.domain.taximeter import Taximeter
from backend.infrastructure.logging.logger import TaximeterLogger
from backend.infrastructure.persistence.ride_repository import RideRepository
from backend.interfaces.api.main import app


class TestTaximeterAPI(unittest.TestCase):

    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()

        temp_path = Path(self.temp_dir.name)

        repository = RideRepository(
            temp_path / "rides.json"
        )

        logger = TaximeterLogger(
            temp_path / "taximeter.log"
        )

        taximeter = Taximeter(
            ride_repository=repository,
            logger=logger
        )

        self.service = TaximeterService(
            taximeter=taximeter
        )

        import backend.interfaces.api.main as api_main

        self.api_main = api_main
        self.original_service = api_main.service

        api_main.service = self.service

        self.client = TestClient(app)
        self.logger = logger

    def tearDown(self):
        self.api_main.service = self.original_service

        for handler in self.logger.logger.handlers[:]:
            handler.close()
            self.logger.logger.removeHandler(handler)

        self.temp_dir.cleanup()

    def test_get_state_initially_idle(self):
        response = self.client.get(
            "/api/taximeter/state"
        )

        self.assertEqual(
            response.status_code,
            200
        )

        self.assertEqual(
            response.json(),
            {
                "state": "idle"
            }
        )

    def test_start_ride(self):
        response = self.client.post(
            "/api/rides/start"
        )

        self.assertEqual(
            response.status_code,
            200
        )

        self.assertEqual(
            response.json(),
            {
                "success": True,
                "message": "Carrera iniciada"
            }
        )

    def test_start_ride_twice(self):
        first_response = self.client.post(
            "/api/rides/start"
        )

        second_response = self.client.post(
            "/api/rides/start"
        )

        self.assertEqual(
            first_response.status_code,
            200
        )

        self.assertEqual(
            second_response.status_code,
            200
        )

        self.assertEqual(
            second_response.json(),
            {
                "success": False,
                "message": "Ya hay una carrera en curso"
            }
        )

    def test_move_ride(self):
        self.client.post(
            "/api/rides/start"
        )

        response = self.client.post(
            "/api/rides/move"
        )

        self.assertEqual(
            response.status_code,
            200
        )

        self.assertEqual(
            response.json(),
            {
                "success": True,
                "message": "Estado: en movimiento"
            }
        )

    def test_stop_ride(self):
        self.client.post(
            "/api/rides/start"
        )

        self.client.post(
            "/api/rides/move"
        )

        response = self.client.post(
            "/api/rides/stop"
        )

        self.assertEqual(
            response.status_code,
            200
        )

        self.assertEqual(
            response.json(),
            {
                "success": True,
                "message": "Estado: detenido"
            }
        )

    def test_finish_ride(self):
        self.client.post(
            "/api/rides/start"
        )

        self.client.post(
            "/api/rides/move"
        )

        self.client.post(
            "/api/rides/stop"
        )

        response = self.client.post(
            "/api/rides/finish"
        )

        self.assertEqual(
            response.status_code,
            200
        )

        data = response.json()

        self.assertTrue(
            data["success"]
        )

        self.assertEqual(
            data["ride_id"],
            1
        )

        self.assertIn(
            "started_at",
            data
        )

        self.assertIn(
            "finished_at",
            data
        )

        self.assertGreaterEqual(
            data["stopped_time"],
            0
        )

        self.assertGreaterEqual(
            data["moving_time"],
            0
        )

        self.assertGreaterEqual(
            data["stopped_cost"],
            0
        )

        self.assertGreaterEqual(
            data["moving_cost"],
            0
        )

        self.assertGreaterEqual(
            data["total"],
            0
        )

    def test_finish_without_active_ride(self):
        response = self.client.post(
            "/api/rides/finish"
        )

        self.assertEqual(
            response.status_code,
            200
        )

        data = response.json()

        self.assertFalse(
            data["success"]
        )

    def test_history(self):
        self.client.post(
            "/api/rides/start"
        )

        self.client.post(
            "/api/rides/move"
        )

        self.client.post(
            "/api/rides/stop"
        )

        self.client.post(
            "/api/rides/finish"
        )

        response = self.client.get(
            "/api/rides/history"
        )

        self.assertEqual(
            response.status_code,
            200
        )

        history = response.json()

        self.assertEqual(
            len(history),
            1
        )

        self.assertEqual(
            history[0]["ride_id"],
            1
        )


if __name__ == "__main__":
    unittest.main()