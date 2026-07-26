from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, or_

from backend.core.database import get_db
from backend.models.entities import AuthenticationLog, User
from backend.schemas.dto import AuthLogResponse, PaginatedResponse
from backend.security.auth import get_current_user

router = APIRouter(prefix="/auth-logs", tags=["Authentication Logs"])

@router.get("", response_model=PaginatedResponse)
async def list_auth_logs(
    user_id: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    country: Optional[str] = Query(None),
    is_flagged: Optional[bool] = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(AuthenticationLog)
    if user_id:
        stmt = stmt.where(AuthenticationLog.user_id == user_id)
    if status_filter:
        stmt = stmt.where(AuthenticationLog.status == status_filter)
    if country:
        stmt = stmt.where(AuthenticationLog.country == country)
    if is_flagged is not None:
        stmt = stmt.where(AuthenticationLog.is_flagged == is_flagged)

    count_stmt = select(func.count()).select_from(stmt.subquery())
    total = (await db.execute(count_stmt)).scalar_one()

    offset = (page - 1) * size
    stmt = stmt.order_by(desc(AuthenticationLog.timestamp)).offset(offset).limit(size)
    logs = (await db.execute(stmt)).scalars().all()

    items = [AuthLogResponse.model_validate(l) for l in logs]
    pages = (total + size - 1) // size if size > 0 else 1

    return PaginatedResponse(
        total=total,
        page=page,
        size=size,
        pages=pages,
        items=items
    )
