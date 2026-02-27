from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth_simple import get_username_by_token
from app.db.session import get_db
from app.schemas.badge_schema import BadgeCreate, BadgeRead
from app.services.badge_service import BadgeService

router = APIRouter(prefix="/badges", tags=["badges"])
service = BadgeService()


def require_token(authorization: str = Header(default="")) -> str:
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token manquant.",
        )
    token = authorization.removeprefix("Bearer ").strip()
    username = get_username_by_token(token)
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide ou expiré.",
        )
    return username


@router.post("", response_model=BadgeRead, status_code=status.HTTP_201_CREATED)
def create_badge(
    payload: BadgeCreate,
    db: Session = Depends(get_db),
    _username: str = Depends(require_token),
) -> BadgeRead:
    return service.create_badge(db, payload)


@router.get("/{badge_id}", response_model=BadgeRead)
def get_badge(
    badge_id: int,
    db: Session = Depends(get_db),
    _username: str = Depends(require_token),
) -> BadgeRead:
    badge = service.get_badge(db, badge_id)
    if badge is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Badge introuvable.")
    return badge


@router.put("/{badge_id}", response_model=BadgeRead)
def update_badge(
    badge_id: int,
    payload: BadgeCreate,
    db: Session = Depends(get_db),
    _username: str = Depends(require_token),
) -> BadgeRead:
    updated = service.update_badge(db, badge_id, payload)
    if updated is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Badge introuvable.")
    return updated


@router.get("", response_model=list[BadgeRead])
def list_badges(
    db: Session = Depends(get_db),
    _username: str = Depends(require_token),
) -> list[BadgeRead]:
    return service.list_badges(db)
