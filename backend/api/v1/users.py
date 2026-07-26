from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, or_

from backend.core.database import get_db
from backend.models.entities import User
from backend.schemas.dto import UserResponse, PaginatedResponse
from backend.security.auth import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("", response_model=PaginatedResponse)
async def list_users(
    query: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(User)
    if query:
        pattern = f"%{query}%"
        stmt = stmt.where(or_(User.email.ilike(pattern), User.full_name.ilike(pattern)))
    if role:
        stmt = stmt.where(User.role == role)
    if department:
        stmt = stmt.where(User.department == department)

    count_stmt = select(func.count()).select_from(stmt.subquery())
    total = (await db.execute(count_stmt)).scalar_one()

    offset = (page - 1) * size
    stmt = stmt.order_by(desc(User.current_risk_score)).offset(offset).limit(size)
    users = (await db.execute(stmt)).scalars().all()

    items = [UserResponse.model_validate(u) for u in users]
    pages = (total + size - 1) // size if size > 0 else 1

    return PaginatedResponse(
        total=total,
        page=page,
        size=size,
        pages=pages,
        items=items
    )

@router.get("/{user_id}", response_model=UserResponse)
async def get_user_detail(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(User).where(User.id == user_id)
    user = (await db.execute(stmt)).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user
