from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.application.taximeter_service import TaximeterService


class TaximeterStateResponse(BaseModel):
    state: str


class TaximeterCurrentResponse(BaseModel):
    state: str
    stopped_time: float
    moving_time: float
    stopped_cost: float
    moving_cost: float
    total: float


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


# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


service = TaximeterService()


# =====================================================
# TAXIMETER
# =====================================================

@app.get(
    "/api/taximeter/state",
    response_model=TaximeterStateResponse
)
def get_taximeter_state():
    return {
        "state": service.get_state()
    }


@app.get(
    "/api/taximeter/current",
    response_model=TaximeterCurrentResponse
)
def get_taximeter_current():
    return service.get_current()


# =====================================================
# RIDES
# =====================================================

@app.post(
    "/api/rides/start",
    response_model=ActionResponse
)
def start_ride():
    result = service.start_ride()

    if not result["success"]:
        raise HTTPException(
            status_code=409,
            detail=result["message"]
        )

    return result


@app.post(
    "/api/rides/move",
    response_model=ActionResponse
)
def move_ride():
    result = service.move_ride()

    if not result["success"]:
        raise HTTPException(
            status_code=409,
            detail=result["message"]
        )

    return result


@app.post(
    "/api/rides/stop",
    response_model=ActionResponse
)
def stop_ride():
    result = service.stop_ride()

    if not result["success"]:
        raise HTTPException(
            status_code=409,
            detail=result["message"]
        )

    return result


@app.post(
    "/api/rides/finish",
    response_model=RideFinishResponse
)
def finish_ride():
    result = service.finish_ride()

    if not result["success"]:
        raise HTTPException(
            status_code=409,
            detail="No se puede finalizar la carrera"
        )

    return result


# =====================================================
# HISTORY
# =====================================================

@app.get(
    "/api/rides/history",
    response_model=list[RideResponse]
)
def get_rides_history():
    return service.get_history()