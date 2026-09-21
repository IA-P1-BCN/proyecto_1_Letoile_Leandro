from fastapi import FastAPI
from pydantic import BaseModel

from backend.application.taximeter_service import TaximeterService


class TaximeterStateResponse(BaseModel):
    state: str


class ActionResponse(BaseModel):
    success: bool
    message: str


class RideResponse(BaseModel):
    ride_id: int
    started_at: str
    finished_at: str
    stopped_time: float
    moving_time: float
    stopped_cost: float
    moving_cost: float
    total: float


class RideFinishResponse(BaseModel):
    success: bool
    ride_id: int
    started_at: str
    finished_at: str
    stopped_time: float
    moving_time: float
    stopped_cost: float
    moving_cost: float
    total: float


app = FastAPI(
    title="TaxiTech Solutions API",
    version="1.0.0"
)


service = TaximeterService()


@app.get(
    "/api/taximeter/state",
    response_model=TaximeterStateResponse
)
def get_taximeter_state():
    return {
        "state": service.get_state()
    }


@app.post(
    "/api/rides/start",
    response_model=ActionResponse
)
def start_ride():
    return service.start_ride()


@app.post(
    "/api/rides/move",
    response_model=ActionResponse
)
def move_ride():
    return service.move_ride()


@app.post(
    "/api/rides/stop",
    response_model=ActionResponse
)
def stop_ride():
    return service.stop_ride()


@app.post(
    "/api/rides/finish",
    response_model=RideFinishResponse
)
def finish_ride():
    return service.finish_ride()


@app.get(
    "/api/rides/history",
    response_model=list[RideResponse]
)
def get_rides_history():
    return service.get_history()