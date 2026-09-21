from backend.domain.taximeter import Taximeter


class TaximeterService:

    def __init__(self, taximeter=None):
        self.taximeter = taximeter or Taximeter()

    def get_state(self):
        return self.taximeter.get_state()

    def get_current(self):
        return self.taximeter.get_current()

    def start_ride(self):
        success, message = self.taximeter.start()

        return {
            "success": success,
            "message": message
        }

    def move_ride(self):
        success, message = self.taximeter.move()

        return {
            "success": success,
            "message": message
        }

    def stop_ride(self):
        success, message = self.taximeter.stop()

        return {
            "success": success,
            "message": message
        }

    def finish_ride(self):
        success, result = self.taximeter.finish()

        if not success:
            return {
                "success": False,
                "ride_id": 0,
                "started_at": "",
                "finished_at": "",
                "stopped_time": 0,
                "moving_time": 0,
                "stopped_cost": 0,
                "moving_cost": 0,
                "total": 0
            }

        return {
            "success": True,
            **result
        }

    def get_history(self):
        rides = self.taximeter.get_history()

        return [
            ride.to_dict()
            for ride in rides
        ]