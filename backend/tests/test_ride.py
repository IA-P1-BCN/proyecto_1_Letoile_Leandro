import unittest

from backend.domain.ride import Ride
from backend.domain.state import TaxiState
from backend.domain.taxi import Taxi


class TestTaxi(unittest.TestCase):

    def test_initial_state_is_idle(self):
        taxi = Taxi()

        self.assertEqual(
            taxi.state,
            TaxiState.IDLE
        )

    def test_start_changes_idle_to_stopped(self):
        taxi = Taxi()

        result = taxi.start()

        self.assertTrue(result)
        self.assertEqual(
            taxi.state,
            TaxiState.STOPPED
        )

    def test_move_changes_stopped_to_moving(self):
        taxi = Taxi()

        taxi.start()

        result = taxi.move()

        self.assertTrue(result)
        self.assertEqual(
            taxi.state,
            TaxiState.MOVING
        )

    def test_stop_changes_moving_to_stopped(self):
        taxi = Taxi()

        taxi.start()
        taxi.move()

        result = taxi.stop()

        self.assertTrue(result)
        self.assertEqual(
            taxi.state,
            TaxiState.STOPPED
        )

    def test_finish_from_stopped(self):
        taxi = Taxi()

        taxi.start()

        result = taxi.finish()

        self.assertTrue(result)
        self.assertEqual(
            taxi.state,
            TaxiState.FINISHED
        )

    def test_finish_from_moving(self):
        taxi = Taxi()

        taxi.start()
        taxi.move()

        result = taxi.finish()

        self.assertTrue(result)
        self.assertEqual(
            taxi.state,
            TaxiState.FINISHED
        )

    def test_cannot_move_from_idle(self):
        taxi = Taxi()

        result = taxi.move()

        self.assertFalse(result)
        self.assertEqual(
            taxi.state,
            TaxiState.IDLE
        )

    def test_cannot_stop_from_idle(self):
        taxi = Taxi()

        result = taxi.stop()

        self.assertFalse(result)
        self.assertEqual(
            taxi.state,
            TaxiState.IDLE
        )

    def test_cannot_finish_from_idle(self):
        taxi = Taxi()

        result = taxi.finish()

        self.assertFalse(result)
        self.assertEqual(
            taxi.state,
            TaxiState.IDLE
        )

    def test_cannot_move_twice(self):
        taxi = Taxi()

        taxi.start()
        taxi.move()

        result = taxi.move()

        self.assertFalse(result)
        self.assertEqual(
            taxi.state,
            TaxiState.MOVING
        )

    def test_cannot_stop_twice(self):
        taxi = Taxi()

        taxi.start()

        result = taxi.stop()

        self.assertFalse(result)
        self.assertEqual(
            taxi.state,
            TaxiState.STOPPED
        )

    def test_cannot_start_twice(self):
        taxi = Taxi()

        taxi.start()

        result = taxi.start()

        self.assertFalse(result)
        self.assertEqual(
            taxi.state,
            TaxiState.STOPPED
        )

    def test_cannot_change_state_after_finish(self):
        taxi = Taxi()

        taxi.start()
        taxi.finish()

        self.assertFalse(taxi.start())
        self.assertFalse(taxi.move())
        self.assertFalse(taxi.stop())
        self.assertFalse(taxi.finish())

        self.assertEqual(
            taxi.state,
            TaxiState.FINISHED
        )


class TestRide(unittest.TestCase):

    def test_new_ride_starts_in_idle(self):
        ride = Ride()

        self.assertFalse(ride.started)

        self.assertEqual(
            ride.taxi.state,
            TaxiState.IDLE
        )

    def test_start_ride(self):
        ride = Ride()

        result = ride.start()

        self.assertTrue(result)
        self.assertTrue(ride.started)

        self.assertEqual(
            ride.taxi.state,
            TaxiState.STOPPED
        )

    def test_cannot_start_ride_twice(self):
        ride = Ride()

        ride.start()

        result = ride.start()

        self.assertFalse(result)

    def test_move_requires_active_ride(self):
        ride = Ride()

        result = ride.move()

        self.assertFalse(result)

    def test_stop_requires_active_ride(self):
        ride = Ride()

        result = ride.stop()

        self.assertFalse(result)

    def test_finish_requires_active_ride(self):
        ride = Ride()

        result = ride.finish()

        self.assertIsNone(result)

    def test_ride_state_flow(self):
        ride = Ride()

        ride.start()

        self.assertEqual(
            ride.taxi.state,
            TaxiState.STOPPED
        )

        ride.move()

        self.assertEqual(
            ride.taxi.state,
            TaxiState.MOVING
        )

        ride.stop()

        self.assertEqual(
            ride.taxi.state,
            TaxiState.STOPPED
        )

    def test_finish_from_stopped(self):
        ride = Ride()

        ride.start()

        result = ride.finish()

        self.assertIsNotNone(result)

        self.assertFalse(ride.started)

        self.assertEqual(
            ride.taxi.state,
            TaxiState.FINISHED
        )

    def test_finish_from_moving(self):
        ride = Ride()

        ride.start()
        ride.move()

        result = ride.finish()

        self.assertIsNotNone(result)

        self.assertFalse(ride.started)

        self.assertEqual(
            ride.taxi.state,
            TaxiState.FINISHED
        )


if __name__ == "__main__":
    unittest.main()