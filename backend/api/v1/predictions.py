from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from backend.core.database import get_db
from backend.models.entities import Prediction, User
from backend.schemas.dto import PredictionResponse
from backend.security.auth import get_current_user

router = APIRouter(prefix="/predictions", tags=["ML Predictions"])

@router.get("", response_model=List[PredictionResponse])
async def list_predictions(
    user_id: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(Prediction)
    if user_id:
        stmt = stmt.where(Prediction.user_id == user_id)
    stmt = stmt.order_by(desc(Prediction.created_at)).limit(limit)
    predictions = (await db.execute(stmt)).scalars().all()
    return [PredictionResponse.model_validate(p) for p in predictions]
