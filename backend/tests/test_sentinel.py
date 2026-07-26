import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

from backend.core.database import Base
from backend.main import app
from backend.ml.pipeline import ml_pipeline
from backend.services.risk_service import RiskScoringEngine
from backend.services.attack_classifier_service import AttackClassificationService
from backend.services.mitre_service import MitreAttackMapper
from backend.services.explainability_service import ExplainabilityService
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
    assert mapping_it["technique_id"] == "T0078" or mapping_it["technique_id"] == "T1078"

@pytest.mark.asyncio
async def test_explainability_service():
    features = {
        "geo_velocity_kmh": 850.0,
        "new_device_flag": 1.0,
        "failed_login_count_1h": 5
    }
    exp = ExplainabilityService.generate_explanation(
        attack_type="Brute Force",
        risk_score=94.5,
        features=features,
        country="Germany",
        device_name="Unrecognized-PC",
        user_name="John Doe"
    )
    assert "mitre_attack" in exp
    assert exp["mitre_attack"]["technique_id"] == "T1110"
    assert len(exp["reasons"]) > 0

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
async def test_repositories(async_db_session):
    org = Organization(name="Test Org", domain="test.com", industry="Security")
    async_db_session.add(org)
    await async_db_session.flush()

    user = User(
        organization_id=org.id,
        email="repo_test@honeywell.com",
        hashed_password=get_password_hash("pass"),
        full_name="Repo Test User",
        role="SOC Analyst",
        department="SOC",
        privilege_level="Standard"
    )
    user_repo = UserRepository(async_db_session)
    created_user = await user_repo.create(user)
    assert created_user.id is not None

    found_user = await user_repo.get_by_email("repo_test@honeywell.com")
    assert found_user is not None
    assert found_user.full_name == "Repo Test User"

@pytest.mark.asyncio
async def test_health_check_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/health")
        assert res.status_code == 200
        assert res.json()["status"] == "HEALTHY"
