from typing import List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, or_
from backend.repositories.base import BaseRepository
from backend.models.entities import (
    Organization, User, Device, AuthenticationLog, ActivityLog,
    BehaviorProfile, RiskScore, Alert, AttackEvent, Incident, Prediction
)

class UserRepository(BaseRepository[User]):
    def __init__(self, session: AsyncSession):
        super().__init__(User, session)

    async def get_by_email(self, email: str) -> Optional[User]:
        stmt = select(User).where(User.email == email)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def search_users(self, query: str, skip: int = 0, limit: int = 50) -> Tuple[List[User], int]:
        pattern = f"%{query}%"
        stmt = select(User).where(
            or_(User.email.ilike(pattern), User.full_name.ilike(pattern), User.department.ilike(pattern))
        )
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = (await self.session.execute(count_stmt)).scalar_one()
        
        stmt = stmt.order_by(desc(User.created_at)).offset(skip).limit(limit)
        results = (await self.session.execute(stmt)).scalars().all()
        return list(results), total

class DeviceRepository(BaseRepository[Device]):
    def __init__(self, session: AsyncSession):
        super().__init__(Device, session)

    async def get_by_user_id(self, user_id: str) -> List[Device]:
        stmt = select(Device).where(Device.user_id == user_id)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_by_mac_and_user(self, mac_address: str, user_id: str) -> Optional[Device]:
        stmt = select(Device).where(Device.mac_address == mac_address, Device.user_id == user_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

class AuthLogRepository(BaseRepository[AuthenticationLog]):
    def __init__(self, session: AsyncSession):
        super().__init__(AuthenticationLog, session)

    async def get_recent_by_user(self, user_id: str, limit: int = 20) -> List[AuthenticationLog]:
        stmt = select(AuthenticationLog).where(AuthenticationLog.user_id == user_id).order_by(desc(AuthenticationLog.timestamp)).limit(limit)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_filtered(self, user_id: Optional[str] = None, status: Optional[str] = None, country: Optional[str] = None, is_flagged: Optional[bool] = None, skip: int = 0, limit: int = 50) -> Tuple[List[AuthenticationLog], int]:
        stmt = select(AuthenticationLog)
        if user_id:
            stmt = stmt.where(AuthenticationLog.user_id == user_id)
        if status:
            stmt = stmt.where(AuthenticationLog.status == status)
        if country:
            stmt = stmt.where(AuthenticationLog.country == country)
        if is_flagged is not None:
            stmt = stmt.where(AuthenticationLog.is_flagged == is_flagged)
            
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = (await self.session.execute(count_stmt)).scalar_one()
        
        stmt = stmt.order_by(desc(AuthenticationLog.timestamp)).offset(skip).limit(limit)
        results = (await self.session.execute(stmt)).scalars().all()
        return list(results), total

class ActivityLogRepository(BaseRepository[ActivityLog]):
    def __init__(self, session: AsyncSession):
        super().__init__(ActivityLog, session)

    async def get_recent_by_user(self, user_id: str, limit: int = 20) -> List[ActivityLog]:
        stmt = select(ActivityLog).where(ActivityLog.user_id == user_id).order_by(desc(ActivityLog.timestamp)).limit(limit)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

class ProfileRepository(BaseRepository[BehaviorProfile]):
    def __init__(self, session: AsyncSession):
        super().__init__(BehaviorProfile, session)

    async def get_by_user_id(self, user_id: str) -> Optional[BehaviorProfile]:
        stmt = select(BehaviorProfile).where(BehaviorProfile.user_id == user_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

class AlertRepository(BaseRepository[Alert]):
    def __init__(self, session: AsyncSession):
        super().__init__(Alert, session)

    async def get_filtered(self, severity: Optional[str] = None, status: Optional[str] = None, user_id: Optional[str] = None, skip: int = 0, limit: int = 50) -> Tuple[List[Alert], int]:
        stmt = select(Alert)
        if severity:
            stmt = stmt.where(Alert.severity == severity)
        if status:
            stmt = stmt.where(Alert.status == status)
        if user_id:
            stmt = stmt.where(Alert.user_id == user_id)
            
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = (await self.session.execute(count_stmt)).scalar_one()
        
        stmt = stmt.order_by(desc(Alert.created_at)).offset(skip).limit(limit)
        results = (await self.session.execute(stmt)).scalars().all()
        return list(results), total

class IncidentRepository(BaseRepository[Incident]):
    def __init__(self, session: AsyncSession):
        super().__init__(Incident, session)

    async def get_all_ordered(self, skip: int = 0, limit: int = 50) -> Tuple[List[Incident], int]:
        stmt = select(Incident)
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = (await self.session.execute(count_stmt)).scalar_one()
        
        stmt = stmt.order_by(desc(Incident.updated_at)).offset(skip).limit(limit)
        results = (await self.session.execute(stmt)).scalars().all()
        return list(results), total

class PredictionRepository(BaseRepository[Prediction]):
    def __init__(self, session: AsyncSession):
        super().__init__(Prediction, session)

    async def get_recent(self, limit: int = 50) -> List[Prediction]:
        stmt = select(Prediction).order_by(desc(Prediction.created_at)).limit(limit)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())
