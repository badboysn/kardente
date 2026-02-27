import base64

from cryptography.fernet import Fernet

from app.core.config import get_settings


def get_fernet() -> Fernet:
    settings = get_settings()
    key = settings.encryption_key.encode("utf-8")
    try:
        base64.urlsafe_b64decode(key)
    except Exception as exc:
        raise ValueError("ENCRYPTION_KEY must be a valid Fernet key.") from exc
    return Fernet(key)
