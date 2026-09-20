import json
from pathlib import Path

from backend.domain.ride_record import RideRecord


class RideRepository:
    def __init__(self, file_path=None):
        if file_path is None:
            file_path = (
                Path(__file__).resolve().parent / "rides.json"
            )

        self.file_path = Path(file_path)
        self._ensure_file()

    def _ensure_file(self):
        if not self.file_path.exists():
            self.file_path.parent.mkdir(
                parents=True,
                exist_ok=True
            )

            self.file_path.write_text(
                "[]",
                encoding="utf-8"
            )

    def get_all(self):
        data = self._load()

        return [
            RideRecord.from_dict(item)
            for item in data
        ]

    def save(self, ride_record):
        rides = self._load()

        rides.append(ride_record.to_dict())

        self.file_path.write_text(
            json.dumps(
                rides,
                indent=4,
                ensure_ascii=False
            ),
            encoding="utf-8"
        )

    def _load(self):
        try:
            content = self.file_path.read_text(
                encoding="utf-8"
            )

            if not content.strip():
                return []

            return json.loads(content)

        except (json.JSONDecodeError, FileNotFoundError):
            return []