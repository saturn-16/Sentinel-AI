from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.database import get_db
from backend.models.entities import User
from backend.schemas.dto import SyntheticGenConfig, AttackSimConfig
from backend.security.auth import get_current_user
from backend.services.generator_service import SyntheticDataGenerator
from backend.services.attack_simulator_service import AttackSimulatorService

router = APIRouter(prefix="/generator", tags=["Synthetic Generator"])

@router.post("/generate-dataset")
async def generate_dataset(
    config: SyntheticGenConfig,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    gen = SyntheticDataGenerator(db)
    result = await gen.generate_enterprise_environment(
        num_users=config.num_users,
        num_days=config.num_days
    )
    return result

@router.post("/simulate-attack")
async def simulate_attack(
    config: AttackSimConfig,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sim = AttackSimulatorService(db)
    result = await sim.simulate_attack(
        attack_type=config.attack_type,
        target_user_id=config.target_user_id,
        severity=config.severity,
        duration_hours=config.duration_hours
    )
    return result
