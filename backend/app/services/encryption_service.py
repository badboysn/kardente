from app.core.security import get_fernet


class EncryptionService:
    def __init__(self) -> None:
        self._fernet = get_fernet()

    def encrypt_value(self, value: str | int | None) -> str | None:
        if value is None:
            return None
        raw = str(value).encode("utf-8")
        return self._fernet.encrypt(raw).decode("utf-8")

    def decrypt_value(self, value: str | None) -> str | None:
        if value is None:
            return None
        raw = self._fernet.decrypt(value.encode("utf-8"))
        return raw.decode("utf-8")
