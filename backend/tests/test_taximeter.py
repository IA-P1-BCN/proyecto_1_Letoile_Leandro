import json
import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from backend.domain.taximeter import Taximeter
from backend.domain.state import TaxiState
from backend.infrastructure.config.tariff_config import TariffConfig
from backend.infrastructure.persistence.ride_repository import RideRepository


class TestTaximeter(unittest.TestCase):

    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()

        self.repository_path = (
            Path(self.temp_dir.name) / "rides.json"
        )

        self.repository = RideRepository(
            self.repository_path
        )

        self.taximeter = Taximeter(
            ride_repository=self.repository
        )

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_initial_state_is_idle(self):
        self.assertEqual(
            self.taximeter.get_state(),
            TaxiState.IDLE.value
        )

    def test_start_ride(self):
        success, message = self.taximeter.start()

        self.assertTrue(success)
        self.assertEqual(message, "Carrera iniciada")

        self.assertEqual(
            self.taximeter.get_state(),
            TaxiState.STOPPED.value
        )

    def test_cannot_start_two_rides(self):
        self.taximeter.start()

        success, message = self.taximeter.start()

        self.assertFalse(success)
        self.assertEqual(
            message,
            "Ya hay una carrera en curso"
        )

    def test_move_changes_state(self):
        self.taximeter.start()

        success, message = self.taximeter.move()

        self.assertTrue(success)
        self.assertEqual(
            message,
            "Estado: en movimiento"
        )

        self.assertEqual(
            self.taximeter.get_state(),
            TaxiState.MOVING.value
        )

    def test_cannot_move_twice(self):
        self.taximeter.start()
        self.taximeter.move()

        success, message = self.taximeter.move()

        self.assertFalse(success)
        self.assertEqual(
            message,
            "El taxi ya está en movimiento"
        )

    def test_stop_changes_state(self):
        self.taximeter.start()
        self.taximeter.move()

        success, message = self.taximeter.stop()

        self.assertTrue(success)
        self.assertEqual(
            message,
            "Estado: detenido"
        )

        self.assertEqual(
            self.taximeter.get_state(),
            TaxiState.STOPPED.value
        )

    def test_cannot_stop_twice(self):
        self.taximeter.start()

        success, message = self.taximeter.stop()

        self.assertFalse(success)
        self.assertEqual(
            message,
            "El taxi ya está detenido"
        )

    def test_cannot_finish_without_ride(self):
        success, message = self.taximeter.finish()

        self.assertFalse(success)
        self.assertEqual(
            message,
            "No hay ninguna carrera en curso"
        )

    @patch("backend.domain.ride.time.time")
    def test_calculates_stopped_time(self, mock_time):
        """
        La carrera comienza en t=100.
        Se finaliza en t=110.
        Tiempo detenido = 10 segundos.
        """

        mock_time.side_effect = [
            100,
            110,
        ]

        self.taximeter.start()

        success, result = self.taximeter.finish()

        self.assertTrue(success)
        self.assertAlmostEqual(
            result["stopped_time"],
            10.0
        )

    @patch("backend.domain.ride.time.time")
    def test_calculates_moving_time(self, mock_time):
        """
        La carrera comienza en t=100.
        Se mueve en t=110.
        Finaliza en t=130.

        Tiempo en movimiento = 20 segundos.
        """

        mock_time.side_effect = [
            100,
            110,
            130,
        ]

        self.taximeter.start()
        self.taximeter.move()

        success, result = self.taximeter.finish()

        self.assertTrue(success)
        self.assertAlmostEqual(
            result["moving_time"],
            20.0
        )

    @patch("backend.domain.ride.time.time")
    def test_calculates_stopped_and_moving_time(
        self,
        mock_time
    ):
        """
        Secuencia:

        start  -> t=100
        move   -> t=110
        stop   -> t=130
        finish -> t=140

        Detenido:
        10 segundos antes de moverse
        + 10 segundos después de detenerse
        = 20 segundos

        Movimiento:
        20 segundos
        """

        mock_time.side_effect = [
            100,
            110,
            130,
            140,
        ]

        self.taximeter.start()
        self.taximeter.move()
        self.taximeter.stop()

        success, result = self.taximeter.finish()

        self.assertTrue(success)

        self.assertAlmostEqual(
            result["stopped_time"],
            20.0
        )

        self.assertAlmostEqual(
            result["moving_time"],
            20.0
        )

    @patch("backend.domain.ride.time.time")
    def test_calculates_stopped_cost(self, mock_time):
        """
        10 segundos detenido × 0.02 €/segundo
        = 0.20 €
        """

        mock_time.side_effect = [
            100,
            110,
        ]

        self.taximeter.start()

        success, result = self.taximeter.finish()

        self.assertTrue(success)

        self.assertAlmostEqual(
            result["stopped_cost"],
            0.20
        )

    @patch("backend.domain.ride.time.time")
    def test_calculates_moving_cost(self, mock_time):
        """
        20 segundos en movimiento × 0.05 €/segundo
        = 1.00 €
        """

        mock_time.side_effect = [
            100,
            110,
            130,
        ]

        self.taximeter.start()
        self.taximeter.move()

        success, result = self.taximeter.finish()

        self.assertTrue(success)

        self.assertAlmostEqual(
            result["moving_cost"],
            1.00
        )

    @patch("backend.domain.ride.time.time")
    def test_calculates_total_cost(self, mock_time):
        """
        Secuencia:

        10 segundos detenido
        20 segundos en movimiento

        Detenido:
        10 × 0.02 = 0.20 €

        Movimiento:
        20 × 0.05 = 1.00 €

        Total:
        1.20 €
        """

        mock_time.side_effect = [
            100,
            110,
            130,
        ]

        self.taximeter.start()
        self.taximeter.move()

        success, result = self.taximeter.finish()

        self.assertTrue(success)

        self.assertAlmostEqual(
            result["stopped_cost"],
            0.20
        )

        self.assertAlmostEqual(
            result["moving_cost"],
            1.00
        )

        self.assertAlmostEqual(
            result["total"],
            1.20
        )

    def test_finish_returns_to_idle(self):
        self.taximeter.start()

        success, result = self.taximeter.finish()

        self.assertTrue(success)

        self.assertEqual(
            self.taximeter.get_state(),
            TaxiState.IDLE.value
        )

    def test_can_start_new_ride_after_finish(self):
        self.taximeter.start()
        self.taximeter.finish()

        success, message = self.taximeter.start()

        self.assertTrue(success)
        self.assertEqual(
            message,
            "Carrera iniciada"
        )

    def test_loads_tariffs_from_configuration(self):
        config = TariffConfig()

        self.assertEqual(
            config.stopped_rate,
            0.02
        )

        self.assertEqual(
            config.moving_rate,
            0.05
        )

    def test_uses_custom_tariff_configuration(self):
        config_data = {
            "stopped": 0.10,
            "moving": 0.20,
        }

        with tempfile.NamedTemporaryFile(
            mode="w",
            suffix=".json",
            delete=False,
            encoding="utf-8"
        ) as file:

            json.dump(config_data, file)
            config_path = file.name

        try:
            config = TariffConfig(config_path)

            taximeter = Taximeter(
                tariff_config=config,
                ride_repository=self.repository
            )

            with patch(
                "backend.domain.ride.time.time",
                side_effect=[100, 110]
            ):
                taximeter.start()

                success, result = taximeter.finish()

            self.assertTrue(success)

            self.assertAlmostEqual(
                result["stopped_cost"],
                1.0
            )

            self.assertAlmostEqual(
                result["total"],
                1.0
            )

        finally:
            os.remove(config_path)

    # =========================================================
    # US-05 — HISTORIAL DE CARRERAS
    # =========================================================

    def test_finish_saves_ride_to_history(self):
        self.taximeter.start()

        success, result = self.taximeter.finish()

        self.assertTrue(success)

        history = self.taximeter.get_history()

        self.assertEqual(len(history), 1)

        self.assertEqual(
            history[0].ride_id,
            1
        )

    def test_first_ride_gets_id_one(self):
        self.taximeter.start()

        success, result = self.taximeter.finish()

        self.assertTrue(success)

        self.assertEqual(
            result["ride_id"],
            1
        )

    def test_second_ride_gets_id_two(self):
        self.taximeter.start()
        self.taximeter.finish()

        self.taximeter.start()
        success, result = self.taximeter.finish()

        self.assertTrue(success)

        self.assertEqual(
            result["ride_id"],
            2
        )

    def test_history_contains_finished_ride_data(self):
        self.taximeter.start()

        success, result = self.taximeter.finish()

        self.assertTrue(success)

        history = self.taximeter.get_history()

        ride = history[0]

        self.assertEqual(
            ride.ride_id,
            result["ride_id"]
        )

        self.assertEqual(
            ride.started_at,
            result["started_at"]
        )

        self.assertEqual(
            ride.finished_at,
            result["finished_at"]
        )

        self.assertAlmostEqual(
            ride.stopped_time,
            result["stopped_time"]
        )

        self.assertAlmostEqual(
            ride.moving_time,
            result["moving_time"]
        )

        self.assertAlmostEqual(
            ride.stopped_cost,
            result["stopped_cost"]
        )

        self.assertAlmostEqual(
            ride.moving_cost,
            result["moving_cost"]
        )

        self.assertAlmostEqual(
            ride.total,
            result["total"]
        )

    def test_history_returns_all_finished_rides(self):
        self.taximeter.start()
        self.taximeter.finish()

        self.taximeter.start()
        self.taximeter.finish()

        self.taximeter.start()
        self.taximeter.finish()

        history = self.taximeter.get_history()

        self.assertEqual(
            len(history),
            3
        )

        self.assertEqual(
            history[0].ride_id,
            1
        )

        self.assertEqual(
            history[1].ride_id,
            2
        )

        self.assertEqual(
            history[2].ride_id,
            3
        )

    def test_history_is_empty_before_any_ride(self):
        history = self.taximeter.get_history()

        self.assertEqual(
            history,
            []
        )


if __name__ == "__main__":
    unittest.main()