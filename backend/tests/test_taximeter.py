import json
import os
import tempfile
import unittest
from unittest.mock import patch

from backend.domain.taximeter import Taximeter
from backend.domain.state import TaxiState
from backend.infrastructure.config.tariff_config import TariffConfig


class TestTaximeter(unittest.TestCase):

    def setUp(self):
        self.taximeter = Taximeter()

    # =====================================================
    # ESTADO INICIAL
    # =====================================================

    def test_initial_state_is_idle(self):
        self.assertEqual(
            self.taximeter.get_state(),
            TaxiState.IDLE.value
        )

    # =====================================================
    # START
    # =====================================================

    def test_start_ride(self):
        success, _ = self.taximeter.start()

        self.assertTrue(success)
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

    # =====================================================
    # MOVE
    # =====================================================

    def test_move_changes_state(self):
        self.taximeter.start()

        success, _ = self.taximeter.move()

        self.assertTrue(success)
        self.assertEqual(
            self.taximeter.get_state(),
            TaxiState.MOVING.value
        )

    def test_cannot_move_twice(self):
        self.taximeter.start()
        self.taximeter.move()

        success, _ = self.taximeter.move()

        self.assertFalse(success)

    # =====================================================
    # STOP
    # =====================================================

    def test_stop_changes_state(self):
        self.taximeter.start()
        self.taximeter.move()

        success, _ = self.taximeter.stop()

        self.assertTrue(success)
        self.assertEqual(
            self.taximeter.get_state(),
            TaxiState.STOPPED.value
        )

    def test_cannot_stop_twice(self):
        self.taximeter.start()

        success, _ = self.taximeter.stop()

        self.assertFalse(success)

    # =====================================================
    # FINISH
    # =====================================================

    def test_cannot_finish_without_ride(self):
        success, _ = self.taximeter.finish()

        self.assertFalse(success)

    def test_finish_returns_to_idle(self):
        self.taximeter.start()

        success, result = self.taximeter.finish()

        self.assertTrue(success)
        self.assertIn("total", result)

        self.assertEqual(
            self.taximeter.get_state(),
            TaxiState.IDLE.value
        )

    def test_can_start_new_ride_after_finish(self):
        self.taximeter.start()
        self.taximeter.finish()

        success, _ = self.taximeter.start()

        self.assertTrue(success)
        self.assertEqual(
            self.taximeter.get_state(),
            TaxiState.STOPPED.value
        )

    # =====================================================
    # CALCULO DE TIEMPO
    # =====================================================

    @patch("backend.domain.ride.time.time")
    def test_calculates_stopped_time(self, mock_time):
        """
        La carrera comienza en t=100.
        Permanece detenida durante 10 segundos.
        Finaliza en t=110.
        """

        mock_time.return_value = 100

        self.taximeter.start()

        mock_time.return_value = 110

        success, result = self.taximeter.finish()

        self.assertTrue(success)

        self.assertAlmostEqual(
            result["stopped_time"],
            10.0,
            places=2
        )

        self.assertAlmostEqual(
            result["moving_time"],
            0.0,
            places=2
        )

    @patch("backend.domain.ride.time.time")
    def test_calculates_moving_time(self, mock_time):
        """
        La carrera comienza en t=100.
        Permanece detenida 5 segundos.
        Se mueve durante 20 segundos.
        Finaliza en t=125.
        """

        mock_time.return_value = 100

        self.taximeter.start()

        mock_time.return_value = 105

        self.taximeter.move()

        mock_time.return_value = 125

        success, result = self.taximeter.finish()

        self.assertTrue(success)

        self.assertAlmostEqual(
            result["stopped_time"],
            5.0,
            places=2
        )

        self.assertAlmostEqual(
            result["moving_time"],
            20.0,
            places=2
        )

    @patch("backend.domain.ride.time.time")
    def test_calculates_stopped_and_moving_time(self, mock_time):
        """
        Secuencia:

        t=100 -> start
        t=110 -> move
        t=130 -> stop
        t=135 -> finish

        Resultado esperado:

        detenido = 10 + 5 = 15 segundos
        movimiento = 20 segundos
        """

        mock_time.return_value = 100
        self.taximeter.start()

        mock_time.return_value = 110
        self.taximeter.move()

        mock_time.return_value = 130
        self.taximeter.stop()

        mock_time.return_value = 135
        success, result = self.taximeter.finish()

        self.assertTrue(success)

        self.assertAlmostEqual(
            result["stopped_time"],
            15.0,
            places=2
        )

        self.assertAlmostEqual(
            result["moving_time"],
            20.0,
            places=2
        )

    # =====================================================
    # CALCULO DE TARIFAS
    # =====================================================

    @patch("backend.domain.ride.time.time")
    def test_calculates_stopped_cost(self, mock_time):
        """
        10 segundos detenido × 0.02 €/segundo
        = 0.20 €
        """

        mock_time.return_value = 100
        self.taximeter.start()

        mock_time.return_value = 110
        success, result = self.taximeter.finish()

        self.assertTrue(success)

        self.assertAlmostEqual(
            result["stopped_cost"],
            0.20,
            places=2
        )

    @patch("backend.domain.ride.time.time")
    def test_calculates_moving_cost(self, mock_time):
        """
        20 segundos en movimiento × 0.05 €/segundo
        = 1.00 €
        """

        mock_time.return_value = 100
        self.taximeter.start()

        mock_time.return_value = 105
        self.taximeter.move()

        mock_time.return_value = 125
        success, result = self.taximeter.finish()

        self.assertTrue(success)

        self.assertAlmostEqual(
            result["moving_cost"],
            1.00,
            places=2
        )

    @patch("backend.domain.ride.time.time")
    def test_calculates_total_cost(self, mock_time):
        """
        Secuencia:

        10 segundos detenido
        20 segundos movimiento
        5 segundos detenido

        Detenido:
        15 × 0.02 = 0.30 €

        Movimiento:
        20 × 0.05 = 1.00 €

        Total:
        1.30 €
        """

        mock_time.return_value = 100
        self.taximeter.start()

        mock_time.return_value = 110
        self.taximeter.move()

        mock_time.return_value = 130
        self.taximeter.stop()

        mock_time.return_value = 135
        success, result = self.taximeter.finish()

        self.assertTrue(success)

        self.assertAlmostEqual(
            result["stopped_time"],
            15.0,
            places=2
        )

        self.assertAlmostEqual(
            result["moving_time"],
            20.0,
            places=2
        )

        self.assertAlmostEqual(
            result["stopped_cost"],
            0.30,
            places=2
        )

        self.assertAlmostEqual(
            result["moving_cost"],
            1.00,
            places=2
        )

        self.assertAlmostEqual(
            result["total"],
            1.30,
            places=2
        )

    # =====================================================
    # CONFIGURACION DE TARIFAS
    # =====================================================

    def test_loads_tariffs_from_configuration(self):
        """
        Comprueba que TariffConfig lee correctamente
        las tarifas desde un archivo JSON.
        """

        with tempfile.NamedTemporaryFile(
            mode="w",
            suffix=".json",
            encoding="utf-8",
            delete=False
        ) as file:

            json.dump(
                {
                    "stopped": 0.10,
                    "moving": 0.20
                },
                file
            )

            config_path = file.name

        try:
            config = TariffConfig(config_path)

            self.assertEqual(
                config.stopped_rate,
                0.10
            )

            self.assertEqual(
                config.moving_rate,
                0.20
            )

        finally:
            os.remove(config_path)

    @patch("backend.domain.ride.time.time")
    def test_uses_custom_tariff_configuration(self, mock_time):
        """
        Comprueba que Taximeter utiliza las tarifas
        proporcionadas mediante TariffConfig.

        Configuración:

        detenido = 0.10 €/segundo
        movimiento = 0.20 €/segundo

        Carrera:

        10 segundos detenido

        Resultado:

        10 × 0.10 = 1.00 €
        """

        with tempfile.NamedTemporaryFile(
            mode="w",
            suffix=".json",
            encoding="utf-8",
            delete=False
        ) as file:

            json.dump(
                {
                    "stopped": 0.10,
                    "moving": 0.20
                },
                file
            )

            config_path = file.name

        try:
            tariff_config = TariffConfig(config_path)

            taximeter = Taximeter(tariff_config)

            mock_time.return_value = 100
            taximeter.start()

            mock_time.return_value = 110

            success, result = taximeter.finish()

            self.assertTrue(success)

            self.assertAlmostEqual(
                result["stopped_cost"],
                1.00,
                places=2
            )

            self.assertAlmostEqual(
                result["total"],
                1.00,
                places=2
            )

        finally:
            os.remove(config_path)


if __name__ == "__main__":
    unittest.main()