import json
import secrets
from dataclasses import dataclass
from threading import Lock

from app.core.config import get_settings


@dataclass
class AuthorizedUser:
    username: str
    password: str


_active_tokens: dict[str, str] = {}
_token_lock = Lock()


def _authorized_users() -> list[AuthorizedUser]:
    raw = get_settings().authorized_users_json
    parsed = json.loads(raw)
    return [AuthorizedUser(**item) for item in parsed]


def verify_credentials(username: str, password: str) -> bool:
    for user in _authorized_users():
        if user.username == username and user.password == password:
            return True
    return False


def create_session_token(username: str) -> str:
    token = secrets.token_urlsafe(32)
    with _token_lock:
        _active_tokens[token] = username
    return token


def validate_token(token: str) -> bool:
    with _token_lock:
        return token in _active_tokens


def get_username_by_token(token: str) -> str | None:
    with _token_lock:
        return _active_tokens.get(token)
