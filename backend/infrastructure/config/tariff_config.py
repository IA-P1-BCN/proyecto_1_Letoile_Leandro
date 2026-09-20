import json
from pathlib import Path


class TariffConfig:
    def __init__(self, config_path=None):
        if config_path is None:
            config_path = (
                Path(__file__).resolve().parent / "tariffs.json"
            )

        self.config_path = Path(config_path)
        self._tariffs = self._load()

    def _load(self):
        with self.config_path.open(
            "r",
            encoding="utf-8"
        ) as file:
            return json.load(file)

    @property
    def stopped_rate(self):
        return self._tariffs["stopped"]

    @property
    def moving_rate(self):
        return self._tariffs["moving"]