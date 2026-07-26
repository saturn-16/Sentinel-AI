from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from backend.core.database import get_db
from backend.models.entities import RiskScore, User
from backend.schemas.dto import RiskScoreResponse
from backend.security.auth import get_current_user

router = APIRouter(prefix="/risk-scores", tags=["Risk Scores"])

@router.get("", response_model=List[RiskScoreResponse])
async def list_risk_scores(
    user_id: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(RiskScore)
    if user_id:
        stmt = stmt.where(RiskScore.user_id == user_id)
    stmt = stmt.order_by(desc(RiskScore.timestamp)).limit(limit)
    scores = (await db.execute(stmt)).scalars().all()
    return [RiskScoreResponse.model_validate(s) for s in scores]
