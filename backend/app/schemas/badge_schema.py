from datetime import datetime
from typing import Literal
import re

from pydantic import BaseModel, Field, field_validator


class BadgeBase(BaseModel):
    nom: str
    prenom: str
    age: int = Field(ge=0, le=120)
    date_naissance: str
    lieu_naissance: str
    telephone: str
    contact_urgence: str
    contact_urgence_numero: str
    nationalite: str
    profession: str
    type_travail: Literal["individuel", "groupe"]
    employeur_nom: str | None = None
    employeur_prenom: str | None = None
    photo_base64: str | None = None
    adresse: str

    @field_validator("employeur_nom", "employeur_prenom")
    @classmethod
    def validate_employeur_fields(cls, value: str | None) -> str | None:
        if value is None:
            return value
        clean = value.strip()
        return clean if clean else None

    @field_validator("nom", "prenom", "contact_urgence")
    @classmethod
    def normalize_uppercase_fields(cls, value: str) -> str:
        return value.strip().upper()

    @field_validator("telephone", "contact_urgence_numero")
    @classmethod
    def validate_phone_digits(cls, value: str) -> str:
        normalized = re.sub(r"\D", "", value)
        if not normalized:
            raise ValueError("Le numero de telephone doit contenir uniquement des chiffres.")
        return normalized


class BadgeCreate(BadgeBase):
    pass


class BadgeRead(BadgeBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
