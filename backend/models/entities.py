import uuid
from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy import String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.core.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

class Organization(Base):
    __tablename__ = "organizations"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    domain: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    industry: Mapped[str] = mapped_column(String(100), nullable=False, default="Aerospace & Security")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)
    
    users: Mapped[List["User"]] = relationship("User", back_populates="organization", cascade="all, delete-orphan")

class User(Base):
    __tablename__ = "users"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    organization_id: Mapped[str] = mapped_column(String(36), ForeignKey("organizations.id"), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), nullable=False, default="SOC Analyst")
    department: Mapped[str] = mapped_column(String(100), nullable=False, default="Security Operations")
    privilege_level: Mapped[str] = mapped_column(String(50), nullable=False, default="Standard")
    work_pattern: Mapped[str] = mapped_column(String(50), nullable=False, default="Standard Business Hours")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    current_risk_score: Mapped[float] = mapped_column(Float, default=10.0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)
    
    organization: Mapped["Organization"] = relationship("Organization", back_populates="users")
    devices: Mapped[List["Device"]] = relationship("Device", back_populates="user", cascade="all, delete-orphan")
    auth_logs: Mapped[List["AuthenticationLog"]] = relationship("AuthenticationLog", back_populates="user", cascade="all, delete-orphan")
    activity_logs: Mapped[List["ActivityLog"]] = relationship("ActivityLog", back_populates="user", cascade="all, delete-orphan")
    behavior_profile: Mapped[Optional["BehaviorProfile"]] = relationship("BehaviorProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    risk_scores: Mapped[List["RiskScore"]] = relationship("RiskScore", back_populates="user", cascade="all, delete-orphan")
    alerts: Mapped[List["Alert"]] = relationship("Alert", back_populates="user", cascade="all, delete-orphan")
    predictions: Mapped[List["Prediction"]] = relationship("Prediction", back_populates="user", cascade="all, delete-orphan")

class Device(Base):
    __tablename__ = "devices"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    device_name: Mapped[str] = mapped_column(String(255), nullable=False)
    device_type: Mapped[str] = mapped_column(String(50), nullable=False, default="Laptop")
    os: Mapped[str] = mapped_column(String(100), nullable=False)
    browser: Mapped[str] = mapped_column(String(100), nullable=False)
    mac_address: Mapped[str] = mapped_column(String(50), nullable=False)
    is_trusted: Mapped[bool] = mapped_column(Boolean, default=True)
    trust_score: Mapped[float] = mapped_column(Float, default=95.0)
    last_seen_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)
    
    user: Mapped["User"] = relationship("User", back_populates="devices")
    auth_logs: Mapped[List["AuthenticationLog"]] = relationship("AuthenticationLog", back_populates="device")
    activity_logs: Mapped[List["ActivityLog"]] = relationship("ActivityLog", back_populates="device")

class AuthenticationLog(Base):
    __tablename__ = "authentication_logs"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    device_id: Mapped[str] = mapped_column(String(36), ForeignKey("devices.id"), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, index=True)
    auth_method: Mapped[str] = mapped_column(String(50), nullable=False, default="SAML SSO + MFA")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="SUCCESS")
    ip_address: Mapped[str] = mapped_column(String(50), nullable=False)
    country: Mapped[str] = mapped_column(String(100), nullable=False)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    user_agent: Mapped[str] = mapped_column(String(255), nullable=False)
    is_flagged: Mapped[bool] = mapped_column(Boolean, default=False)
    risk_score_value: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    
    user: Mapped["User"] = relationship("User", back_populates="auth_logs")
    device: Mapped["Device"] = relationship("Device", back_populates="auth_logs")

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    device_id: Mapped[str] = mapped_column(String(36), ForeignKey("devices.id"), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, index=True)
    resource_accessed: Mapped[str] = mapped_column(String(255), nullable=False)
    action_type: Mapped[str] = mapped_column(String(100), nullable=False)
    command_executed: Mapped[str] = mapped_column(String(255), nullable=True)
    session_id: Mapped[str] = mapped_column(String(100), nullable=False)
    duration_seconds: Mapped[int] = mapped_column(Integer, default=300)
    bytes_transferred: Mapped[int] = mapped_column(Integer, default=1024)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    
    user: Mapped["User"] = relationship("User", back_populates="activity_logs")
    device: Mapped["Device"] = relationship("Device", back_populates="activity_logs")

class BehaviorProfile(Base):
    __tablename__ = "behavior_profiles"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False, unique=True, index=True)
    normal_login_hours: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    normal_countries: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    normal_devices: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    normal_ip_ranges: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    auth_frequency_avg: Mapped[float] = mapped_column(Float, default=5.0)
    session_duration_avg: Mapped[float] = mapped_column(Float, default=28800.0)
    common_resources: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    privilege_usage: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    frequent_commands: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    behavior_consistency_score: Mapped[float] = mapped_column(Float, default=95.0)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)
    
    user: Mapped["User"] = relationship("User", back_populates="behavior_profile")

class RiskScore(Base):
    __tablename__ = "risk_scores"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, index=True)
    score: Mapped[float] = mapped_column(Float, nullable=False)
    level: Mapped[str] = mapped_column(String(20), nullable=False)
    ml_confidence: Mapped[float] = mapped_column(Float, nullable=False)
    behavior_deviation: Mapped[float] = mapped_column(Float, nullable=False)
    attack_indicators: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    explainability_notes: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    
    user: Mapped["User"] = relationship("User", back_populates="risk_scores")

class Alert(Base):
    __tablename__ = "alerts"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    event_type: Mapped[str] = mapped_column(String(100), nullable=False)
    risk_score_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    severity: Mapped[str] = mapped_column(String(20), nullable=False, default="Medium")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="Open")
    assigned_to: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    explanation: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, index=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)
    
    user: Mapped["User"] = relationship("User", back_populates="alerts")
    attack_event: Mapped[Optional["AttackEvent"]] = relationship("AttackEvent", back_populates="alert", uselist=False, cascade="all, delete-orphan")

class AttackEvent(Base):
    __tablename__ = "attack_events"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    alert_id: Mapped[str] = mapped_column(String(36), ForeignKey("alerts.id"), nullable=False, unique=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    attack_type: Mapped[str] = mapped_column(String(100), nullable=False)
    confidence_score: Mapped[float] = mapped_column(Float, nullable=False)
    details: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    
    alert: Mapped["Alert"] = relationship("Alert", back_populates="attack_event")

class Incident(Base):
    __tablename__ = "incidents"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    severity: Mapped[str] = mapped_column(String(20), nullable=False, default="High")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="Investigating")
    assigned_to: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    lead_analyst_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    resolution_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

class Prediction(Base):
    __tablename__ = "predictions"
    
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    model_name: Mapped[str] = mapped_column(String(100), nullable=False, default="Ensemble_IF_OCSVM")
    anomaly_score: Mapped[float] = mapped_column(Float, nullable=False)
    confidence_score: Mapped[float] = mapped_column(Float, nullable=False)
    prediction_probability: Mapped[float] = mapped_column(Float, nullable=False)
    is_anomaly: Mapped[bool] = mapped_column(Boolean, nullable=False)
    feature_vector: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, index=True)
    
    user: Mapped["User"] = relationship("User", back_populates="predictions")
