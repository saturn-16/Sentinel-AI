import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

from backend.core.database import Base, get_db
from backend.main import app
from backend.ml.pipeline import ml_pipeline
from backend.services.risk_service import RiskScoringEngine
from backend.services.attack_classifier_service import AttackClassificationService

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
async def test_ml_pipeline_prediction():
    sample_features = {
        "login_hour_dev": 4.5,
        "new_device_flag": 1.0,
        "geo_velocity_kmh": 850.0,
        "auth_freq_delta": 3.0,
        "device_trust_score": 30.0,
        "session_dev_hours": 2.0,
        "resource_rarity_score": 0.8,
        "failed_login_count_1h": 5.0,
        "ip_reputation_score": 85.0,
        "privilege_dev_flag": 1.0,
        "hist_anomaly_rate": 0.4,
        "behavior_consistency_score": 60.0
    }
    
    pred = ml_pipeline.predict(sample_features)
    assert "anomaly_score" in pred
    assert "confidence_score" in pred
    assert pred["is_anomaly"] is True

@pytest.mark.asyncio
async def test_risk_scoring_engine():
    ml_pred = {"prediction_probability": 0.85, "confidence_score": 92.0}
    features = {"login_hour_dev": 5.0, "new_device_flag": 1.0, "failed_login_count_1h": 6.0}
    
    score, level, conf, dev = RiskScoringEngine.calculate_risk(ml_pred, features, user_privilege="Admin")
    assert score >= 70.0
    assert level in ["High", "Critical"]

@pytest.mark.asyncio
async def test_attack_classification():
    features = {"failed_login_count_1h": 6.0, "new_device_flag": 1.0, "ip_reputation_score": 80.0}
    attack_type, conf = AttackClassificationService.classify(features, is_anomaly=True, status="FAILED")
    assert attack_type == "Brute Force"
    assert conf > 0.80

@pytest.mark.asyncio
async def test_health_check_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/health")
        assert res.status_code == 200
        assert res.json()["status"] == "HEALTHY"
