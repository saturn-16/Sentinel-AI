from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc

from backend.core.database import get_db
from backend.models.entities import Incident, User
from backend.schemas.dto import IncidentCreate, IncidentUpdate, IncidentResponse, PaginatedResponse
from backend.security.auth import get_current_user

router = APIRouter(prefix="/incidents", tags=["Incidents"])

@router.get("", response_model=PaginatedResponse)
async def list_incidents(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(Incident)
    count_stmt = select(func.count()).select_from(stmt.subquery())
    total = (await db.execute(count_stmt)).scalar_one()

    offset = (page - 1) * size
    stmt = stmt.order_by(desc(Incident.updated_at)).offset(offset).limit(size)
    incidents = (await db.execute(stmt)).scalars().all()

    items = [IncidentResponse.model_validate(inc) for inc in incidents]
    pages = (total + size - 1) // size if size > 0 else 1

    return PaginatedResponse(
        total=total,
        page=page,
        size=size,
        pages=pages,
        items=items
    )

@router.post("", response_model=IncidentResponse, status_code=status.HTTP_201_CREATED)
async def create_incident(
    body: IncidentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    inc = Incident(
        title=body.title,
        description=body.description,
        severity=body.severity,
        status="Investigating",
        assigned_to=body.assigned_to or current_user.full_name,
        lead_analyst_id=current_user.id
    )
    db.add(inc)
    await db.commit()
    await db.refresh(inc)
    return inc

@router.patch("/{incident_id}", response_model=IncidentResponse)
async def update_incident(
    incident_id: str,
    body: IncidentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(Incident).where(Incident.id == incident_id)
    inc = (await db.execute(stmt)).scalar_one_or_none()
    if not inc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incident not found")

    if body.title:
        inc.title = body.title
    if body.description:
        inc.description = body.description
    if body.severity:
        inc.severity = body.severity
    if body.status:
        inc.status = body.status
    if body.assigned_to:
        inc.assigned_to = body.assigned_to
    if body.resolution_notes:
        inc.resolution_notes = body.resolution_notes

    await db.commit()
    await db.refresh(inc)
    return inc
