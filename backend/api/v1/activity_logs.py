from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc

from backend.core.database import get_db
from backend.models.entities import ActivityLog, User
from backend.schemas.dto import ActivityLogResponse, PaginatedResponse
from backend.security.auth import get_current_user

router = APIRouter(prefix="/activity-logs", tags=["Activity Logs"])

@router.get("", response_model=PaginatedResponse)
async def list_activity_logs(
    user_id: Optional[str] = Query(None),
    resource: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(ActivityLog)
    if user_id:
        stmt = stmt.where(ActivityLog.user_id == user_id)
    if resource:
        stmt = stmt.where(ActivityLog.resource_accessed.ilike(f"%{resource}%"))

    count_stmt = select(func.count()).select_from(stmt.subquery())
    total = (await db.execute(count_stmt)).scalar_one()

    offset = (page - 1) * size
    stmt = stmt.order_by(desc(ActivityLog.timestamp)).offset(offset).limit(size)
    logs = (await db.execute(stmt)).scalars().all()

    items = [ActivityLogResponse.model_validate(l) for l in logs]
    pages = (total + size - 1) // size if size > 0 else 1

    return PaginatedResponse(
        total=total,
        page=page,
        size=size,
        pages=pages,
        items=items
    )
