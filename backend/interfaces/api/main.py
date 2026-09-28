import os

from fastapi import (
    Depends,
    FastAPI,
    HTTPException,
    Request,
)

from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

from starlette.middleware.sessions import SessionMiddleware

from backend.application.auth_service import AuthService

from backend.application.taximeter_service import TaximeterService


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    success: bool
    username: str
    role: str


class UserResponse(BaseModel):
    authenticated: bool
    username: str | None = None
    role: str | None = None


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


app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv(
        "SESSION_SECRET",
        "taxitech-dev-secret-change-me"
    ),
    session_cookie="taxitech_session",
    max_age=60 * 60 * 8,
    same_site="lax",
    https_only=False,
)


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

auth_service = AuthService()


def get_current_user(request: Request):
    user_id = request.session.get("user_id")

    if user_id is None:
        raise HTTPException(
            status_code=401,
            detail="No autenticado"
        )

    return {
        "user_id": user_id,
        "username": request.session.get("username"),
        "role": request.session.get("role"),
    }


@app.post(
    "/api/auth/login",
    response_model=LoginResponse
)
def login(
    credentials: LoginRequest,
    request: Request,
):
    user = auth_service.authenticate(
        credentials.username,
        credentials.password,
    )

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Usuario o contraseña incorrectos"
        )

    request.session["user_id"] = user.user_id
    request.session["username"] = user.username
    request.session["role"] = user.role

    return {
        "success": True,
        "username": user.username,
        "role": user.role,
    }


@app.post(
    "/api/auth/logout"
)
def logout(request: Request):
    request.session.clear()

    return {
        "success": True,
        "message": "Sesión cerrada"
    }


@app.get(
    "/api/auth/me",
    response_model=UserResponse
)
def get_current_session(request: Request):
    user_id = request.session.get("user_id")

    if user_id is None:
        return {
            "authenticated": False,
            "username": None,
            "role": None,
        }

    return {
        "authenticated": True,
        "username": request.session.get("username"),
        "role": request.session.get("role"),
    }


@app.get(
    "/api/taximeter/state",
    response_model=TaximeterStateResponse
)
def get_taximeter_state(
    current_user: dict = Depends(get_current_user)
):
    return {
        "state": service.get_state()
    }


@app.get(
    "/api/taximeter/current",
    response_model=TaximeterCurrentResponse
)
def get_taximeter_current(
    current_user: dict = Depends(get_current_user)
):
    return service.get_current()


@app.post(
    "/api/rides/start",
    response_model=ActionResponse
)
def start_ride(
    current_user: dict = Depends(get_current_user)
):
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
def move_ride(
    current_user: dict = Depends(get_current_user)
):
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
def stop_ride(
    current_user: dict = Depends(get_current_user)
):
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
def finish_ride(
    current_user: dict = Depends(get_current_user)
):
    result = service.finish_ride()

    if not result["success"]:
        raise HTTPException(
            status_code=409,
            detail="No se puede finalizar la carrera"
        )

    return result


@app.get(
    "/api/rides/history",
    response_model=list[RideResponse]
)
def get_rides_history(
    current_user: dict = Depends(get_current_user)
):
    return service.get_history()