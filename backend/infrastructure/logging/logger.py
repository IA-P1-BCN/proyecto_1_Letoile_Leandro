import logging
from pathlib import Path


class TaximeterLogger:
    def __init__(self, log_file=None):
        if log_file is None:
            log_file = (
                Path(__file__).resolve().parent
                / "taximeter.log"
            )

        self.log_file = Path(log_file)

        self.log_file.parent.mkdir(
            parents=True,
            exist_ok=True
        )

        self.logger = logging.getLogger(
            f"taximeter.{self.log_file}"
        )

        self.logger.setLevel(logging.INFO)

        self.logger.propagate = False

        if not self.logger.handlers:
            handler = logging.FileHandler(
                self.log_file,
                encoding="utf-8"
            )

            formatter = logging.Formatter(
                "%(asctime)s - %(levelname)s - %(message)s"
            )

            handler.setFormatter(formatter)

            self.logger.addHandler(handler)

    def info(self, message):
        self.logger.info(message)

    def warning(self, message):
        self.logger.warning(message)

    def error(self, message):
        self.logger.error(message)