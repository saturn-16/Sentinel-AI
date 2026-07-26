import os
import json
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

from backend.core.database import Base
from backend.main import app
from backend.ml.pipeline import ml_pipeline, FEATURE_NAMES
from backend.services.risk_service import RiskScoringEngine
from backend.services.attack_classifier_service import AttackClassificationService
from backend.services.mitre_service import MitreAttackMapper
from backend.services.explainability_service import ExplainabilityService
from backend.services.feature_service import FeatureExtractionService
from backend.services.threat_scenario_engine import ThreatScenarioEngine
from backend.services.generator_service import SyntheticDataGenerator
from backend.security.auth import get_password_hash, verify_password, create_access_token
from backend.repositories.repositories import UserRepository, DeviceRepository, AlertRepository
from backend.models.entities import User, Device, Alert, Organization

TEST_DB_URL = "sqlite+aiosqlite:///:memory:"

@pytest_asyncio.fixture
async def async_db_session():
    engine = create_async_engine(TEST_DB_URL, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    session_factory = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
    async with session_factory() as session:
        yield session
        await session.rollback()
    
    await engine.dispose()

@pytest.mark.asyncio
async def test_password_and_token_security():
    password = "SentinelPass2026!"
    hashed = get_password_hash(password)
    assert verify_password(password, hashed) is True
    assert verify_password("WrongPassword", hashed) is False

    token = create_access_token(data={"sub": "user-123", "email": "test@honeywell.com"})
    assert isinstance(token, str)
    assert len(token) > 20

@pytest.mark.asyncio
async def test_mitre_attack_mapping():
    mapping_bf = MitreAttackMapper.get_mapping("Brute Force")
    assert mapping_bf["technique_id"] == "T1110"
    assert "TA0006" in mapping_bf["tactic"]

    mapping_it = MitreAttackMapper.get_mapping("Impossible Travel")
    assert mapping_it["technique_id"] == "T1078"

@pytest.mark.asyncio
async def test_24_feature_extraction_and_importance():
    features = {
        "geo_velocity_kmh": 850.0,
        "failed_login_count_1h": 6,
        "new_device_flag": 1.0,
        "tor_usage_flag": 1.0
    }
    contributions = FeatureExtractionService.calculate_feature_importance(features)
    assert len(contributions) > 0
    assert contributions[0]["percentage"] > 0
    assert len(FEATURE_NAMES) == 24

@pytest.mark.asyncio
async def test_ml_pipeline_prediction():
    sample_features = {k: 0.0 for k in FEATURE_NAMES}
    sample_features["geo_velocity_kmh"] = 850.0
    sample_features["failed_login_count_1h"] = 6.0
    sample_features["tor_usage_flag"] = 1.0
    
    pred = ml_pipeline.predict(sample_features)
    assert "anomaly_score" in pred
    assert "confidence_score" in pred
    assert pred["is_anomaly"] is True

@pytest.mark.asyncio
async def test_threat_scenario_engine(async_db_session):
    gen = SyntheticDataGenerator(async_db_session)
    await gen.generate_enterprise_environment(num_users=5, num_days=1)
    
    engine = ThreatScenarioEngine(async_db_session)
    auth_log = await engine.inject_threat_scenario("Brute Force")
    assert auth_log.id is not None
    assert auth_log.risk_score_value == 0.0
    assert auth_log.is_flagged is False

@pytest.mark.asyncio
async def test_risk_scoring_engine():
    ml_pred = {"prediction_probability": 0.85, "confidence_score": 92.0}
    features = {"login_hour_dev": 5.0, "new_device_flag": 1.0, "failed_login_count_1h": 6.0}
    
    score, level, conf, dev = RiskScoringEngine.calculate_risk(ml_pred, features, user_privilege="Admin")
    assert score >= 70.0
    assert level in ["High", "Critical"]

@pytest.mark.asyncio
async def test_health_check_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/health")
        assert res.status_code == 200
        assert res.json()["status"] == "HEALTHY"
