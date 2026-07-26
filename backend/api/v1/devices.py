from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from backend.core.database import get_db
from backend.models.entities import Device, User
from backend.schemas.dto import DeviceResponse, DeviceUpdateTrust
from backend.security.auth import get_current_user

router = APIRouter(prefix="/devices", tags=["Devices"])

@router.get("", response_model=List[DeviceResponse])
async def list_devices(
    user_id: Optional[str] = Query(None),
    is_trusted: Optional[bool] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(Device)
    if user_id:
        stmt = stmt.where(Device.user_id == user_id)
    if is_trusted is not None:
        stmt = stmt.where(Device.is_trusted == is_trusted)

    stmt = stmt.order_by(desc(Device.last_seen_at))
    devices = (await db.execute(stmt)).scalars().all()
    return [DeviceResponse.model_validate(d) for d in devices]

@router.get("/{device_id}", response_model=DeviceResponse)
async def get_device(
    device_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(Device).where(Device.id == device_id)
    device = (await db.execute(stmt)).scalar_one_or_none()
    if not device:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Device not found")
    return device

@router.patch("/{device_id}/trust", response_model=DeviceResponse)
async def update_device_trust(
    device_id: str,
    trust_in: DeviceUpdateTrust,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(Device).where(Device.id == device_id)
    device = (await db.execute(stmt)).scalar_one_or_none()
    if not device:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Device not found")

    device.is_trusted = trust_in.is_trusted
    device.trust_score = 95.0 if trust_in.is_trusted else 25.0
    await db.commit()
    await db.refresh(device)
    return device
