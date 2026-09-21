import tempfile
import unittest
from pathlib import Path

from backend.infrastructure.logging.logger import TaximeterLogger


class TestTaximeterLogger(unittest.TestCase):

    def _close_logger(self, logger):
        for handler in logger.logger.handlers:
            handler.close()

        logger.logger.handlers.clear()

    def test_creates_log_file(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            log_file = Path(temp_dir) / "taximeter.log"

            logger = TaximeterLogger(log_file)

            self.assertTrue(log_file.exists())

            self._close_logger(logger)

    def test_writes_info_message(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            log_file = Path(temp_dir) / "taximeter.log"

            logger = TaximeterLogger(log_file)

            logger.info("Carrera iniciada")

            content = log_file.read_text(
                encoding="utf-8"
            )

            self.assertIn(
                "Carrera iniciada",
                content
            )

            self._close_logger(logger)

    def test_writes_warning_message(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            log_file = Path(temp_dir) / "taximeter.log"

            logger = TaximeterLogger(log_file)

            logger.warning("Acción inválida")

            content = log_file.read_text(
                encoding="utf-8"
            )

            self.assertIn(
                "WARNING",
                content
            )

            self.assertIn(
                "Acción inválida",
                content
            )

            self._close_logger(logger)

    def test_writes_error_message(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            log_file = Path(temp_dir) / "taximeter.log"

            logger = TaximeterLogger(log_file)

            logger.error("Error de prueba")

            content = log_file.read_text(
                encoding="utf-8"
            )

            self.assertIn(
                "ERROR",
                content
            )

            self.assertIn(
                "Error de prueba",
                content
            )

            self._close_logger(logger)


if __name__ == "__main__":
    unittest.main()