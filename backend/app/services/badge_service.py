from sqlalchemy.orm import Session
from cryptography.fernet import InvalidToken

from app.models.badge import Badge
from app.schemas.badge_schema import BadgeCreate, BadgeRead
from app.services.encryption_service import EncryptionService


class BadgeService:
    def __init__(self) -> None:
        self._crypto = EncryptionService()
        self._encrypted_fields = [
            "nom",
            "prenom",
            "age",
            "date_naissance",
            "lieu_naissance",
            "telephone",
            "contact_urgence",
            "contact_urgence_numero",
            "nationalite",
            "profession",
            "employeur_nom",
            "employeur_prenom",
            "photo_base64",
            "adresse",
        ]

    def _encrypt_payload(self, payload: BadgeCreate) -> dict:
        data = payload.model_dump()
        encrypted: dict = {}
        for key, value in data.items():
            if key in self._encrypted_fields:
                encrypted[key] = self._crypto.encrypt_value(value)
            else:
                encrypted[key] = value
        return encrypted

    @staticmethod
    def _normalize_payload(payload: BadgeCreate) -> BadgeCreate:
        data = payload.model_dump()
        if data["type_travail"] == "individuel":
            data["employeur_nom"] = None
            data["employeur_prenom"] = None
        return BadgeCreate(**data)

    def _decrypt_model(self, model: Badge) -> BadgeRead:
        data = {
            "id": model.id,
            "type_travail": model.type_travail,
            "created_at": model.created_at,
        }
        for field in self._encrypted_fields:
            decrypted = self._crypto.decrypt_value(getattr(model, field))
            if field == "age" and decrypted is not None:
                data[field] = int(decrypted)
            else:
                data[field] = decrypted
        return BadgeRead(**data)

    def create_badge(self, db: Session, payload: BadgeCreate) -> BadgeRead:
        normalized_payload = self._normalize_payload(payload)
        encrypted_payload = self._encrypt_payload(normalized_payload)
        badge = Badge(**encrypted_payload)
        db.add(badge)
        db.commit()
        db.refresh(badge)
        return self._decrypt_model(badge)

    def update_badge(self, db: Session, badge_id: int, payload: BadgeCreate) -> BadgeRead | None:
        badge = db.get(Badge, badge_id)
        if badge is None:
            return None

        normalized_payload = self._normalize_payload(payload)
        encrypted_payload = self._encrypt_payload(normalized_payload)
        for key, value in encrypted_payload.items():
            setattr(badge, key, value)

        db.commit()
        db.refresh(badge)
        return self._decrypt_model(badge)

    def get_badge(self, db: Session, badge_id: int) -> BadgeRead | None:
        badge = db.get(Badge, badge_id)
        if badge is None:
            return None
        try:
            return self._decrypt_model(badge)
        except InvalidToken:
            return None

    def list_badges(self, db: Session) -> list[BadgeRead]:
        badges = db.query(Badge).order_by(Badge.created_at.desc()).all()
        result: list[BadgeRead] = []
        for item in badges:
            try:
                result.append(self._decrypt_model(item))
            except InvalidToken:
                # If a row was encrypted with a different key, skip it
                # instead of failing the whole listing endpoint.
                continue
        return result
