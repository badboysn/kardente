from fastapi import APIRouter, HTTPException, status

from app.core.auth_simple import create_session_token, verify_credentials
from app.schemas.user_schema import LoginRequest, LoginResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest) -> LoginResponse:
    if not verify_credentials(payload.username, payload.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Identifiants invalides.",
        )
    token = create_session_token(payload.username)
    return LoginResponse(access_token=token)
