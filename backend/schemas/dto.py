from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "SOC Analyst"
    department: str = "Security Operations"
    privilege_level: str = "Standard"
    work_pattern: str = "Standard Business Hours"
    organization_id: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    organization_id: str
    email: str
    full_name: str
    role: str
    department: str
    privilege_level: str
    work_pattern: str
    is_active: bool
    current_risk_score: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class OrganizationResponse(BaseModel):
    id: str
    name: str
    domain: str
    industry: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DeviceResponse(BaseModel):
    id: str
    user_id: str
    device_name: str
    device_type: str
    os: str
    browser: str
    mac_address: str
    is_trusted: bool
    trust_score: float
    last_seen_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True

class DeviceUpdateTrust(BaseModel):
    is_trusted: bool

class AuthLogResponse(BaseModel):
    id: str
    user_id: str
    device_id: str
    timestamp: datetime
    auth_method: str
    status: str
    ip_address: str
    country: str
    city: str
    user_agent: str
    is_flagged: bool
    risk_score_value: float

    class Config:
        from_attributes = True

class ActivityLogResponse(BaseModel):
    id: str
    user_id: str
    device_id: str
    timestamp: datetime
    resource_accessed: str
    action_type: str
    command_executed: Optional[str] = None
    session_id: str
    duration_seconds: int
    bytes_transferred: int

    class Config:
        from_attributes = True

class BehaviorProfileResponse(BaseModel):
    id: str
    user_id: str
    normal_login_hours: Dict[str, Any]
    normal_countries: Dict[str, Any]
    normal_devices: Dict[str, Any]
    normal_ip_ranges: Dict[str, Any]
    auth_frequency_avg: float
    session_duration_avg: float
    common_resources: Dict[str, Any]
    privilege_usage: Dict[str, Any]
    frequent_commands: Dict[str, Any]
    behavior_consistency_score: float
    updated_at: datetime

    class Config:
        from_attributes = True

class RiskScoreResponse(BaseModel):
    id: str
    user_id: str
    timestamp: datetime
    score: float
    level: str
    ml_confidence: float
    behavior_deviation: float
    attack_indicators: Dict[str, Any]
    explainability_notes: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True

class AlertUpdateStatus(BaseModel):
    status: str
    assigned_to: Optional[str] = None

class AttackEventResponse(BaseModel):
    id: str
    alert_id: str
    user_id: str
    attack_type: str
    confidence_score: float
    details: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True

class AlertResponse(BaseModel):
    id: str
    user_id: str
    event_type: str
    risk_score_id: Optional[str] = None
    title: str
    severity: str
    status: str
    assigned_to: Optional[str] = None
    explanation: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    user: Optional[UserResponse] = None
    attack_event: Optional[AttackEventResponse] = None

    class Config:
        from_attributes = True

class IncidentCreate(BaseModel):
    title: str
    description: str
    severity: str = "High"
    assigned_to: Optional[str] = None

class IncidentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[str] = None
    status: Optional[str] = None
    assigned_to: Optional[str] = None
    resolution_notes: Optional[str] = None

class IncidentResponse(BaseModel):
    id: str
    title: str
    description: str
    severity: str
    status: str
    assigned_to: Optional[str] = None
    lead_analyst_id: Optional[str] = None
    resolution_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PredictionResponse(BaseModel):
    id: str
    user_id: str
    model_name: str
    anomaly_score: float
    confidence_score: float
    prediction_probability: float
    is_anomaly: bool
    feature_vector: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True

class SyntheticGenConfig(BaseModel):
    num_users: int = Field(default=50, ge=5, le=500)
    num_days: int = Field(default=7, ge=1, le=30)
    attack_ratio: float = Field(default=0.15, ge=0.0, le=0.5)

class AttackSimConfig(BaseModel):
    attack_type: str
    target_user_id: Optional[str] = None
    severity: str = "High"
    duration_hours: int = 1

class AnalyticsOverview(BaseModel):
    total_users: int
    active_sessions: int
    today_alerts: int
    critical_alerts: int
    avg_risk_score: float
    detection_accuracy: float
    threat_level: str
    detection_latency_ms: float
    false_positive_rate: float
    precision: float
    recall: float
    f1_score: float
    risk_distribution: Dict[str, int]
    severity_distribution: Dict[str, int]
    attack_distribution: Dict[str, int]
    top_risky_users: List[Dict[str, Any]]
    top_risky_devices: List[Dict[str, Any]]
    risk_trend: List[Dict[str, Any]]
    hourly_heatmap: List[Dict[str, Any]]

class PaginatedResponse(BaseModel):
    total: int
    page: int
    size: int
    pages: int
    items: List[Any]
