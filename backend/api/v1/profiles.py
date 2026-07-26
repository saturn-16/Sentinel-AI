from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.core.database import get_db
from backend.models.entities import BehaviorProfile, User
from backend.schemas.dto import BehaviorProfileResponse
from backend.security.auth import get_current_user

router = APIRouter(prefix="/profiles", tags=["Behavior Profiles"])

@router.get("/user/{user_id}", response_model=BehaviorProfileResponse)
async def get_user_profile(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(BehaviorProfile).where(BehaviorProfile.user_id == user_id)
    profile = (await db.execute(stmt)).scalar_one_or_none()
    if not profile:
        profile = BehaviorProfile(
            user_id=user_id,
            normal_login_hours={"hours": [8, 9, 10, 11, 12, 13, 14, 15, 16, 17]},
            normal_countries={"countries": ["United States", "India", "Germany"]},
            normal_devices={"device_ids": []},
            normal_ip_ranges={"ips": ["192.168.1.0/24"]},
            auth_frequency_avg=4.5,
            session_duration_avg=28800.0,
            common_resources={"resources": ["/api/v1/auth/login"]},
            privilege_usage={"privilege": "Standard"},
            frequent_commands={"commands": ["kubectl get pods"]},
            behavior_consistency_score=94.5
        )
        db.add(profile)
        await db.commit()
        await db.refresh(profile)
    return profile
