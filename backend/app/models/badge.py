from datetime import date, datetime

from sqlalchemy import Date, DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class Badge(Base):
    __tablename__ = "badges"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nom: Mapped[str] = mapped_column(Text, nullable=False)
    prenom: Mapped[str] = mapped_column(Text, nullable=False)
    age: Mapped[str] = mapped_column(Text, nullable=False)
    date_naissance: Mapped[str] = mapped_column(Text, nullable=False)
    lieu_naissance: Mapped[str] = mapped_column(Text, nullable=False)
    telephone: Mapped[str] = mapped_column(Text, nullable=False)
    contact_urgence: Mapped[str] = mapped_column(Text, nullable=False)
    contact_urgence_numero: Mapped[str] = mapped_column(Text, nullable=False)
    nationalite: Mapped[str] = mapped_column(Text, nullable=False)
    profession: Mapped[str] = mapped_column(Text, nullable=False)
    type_travail: Mapped[str] = mapped_column(String(20), nullable=False)
    employeur_nom: Mapped[str | None] = mapped_column(Text, nullable=True)
    employeur_prenom: Mapped[str | None] = mapped_column(Text, nullable=True)
    photo_base64: Mapped[str | None] = mapped_column(Text, nullable=True)
    adresse: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
