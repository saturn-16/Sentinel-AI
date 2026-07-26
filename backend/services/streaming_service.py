from datetime import datetime, timezone
from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.models.entities import (
    User, Device, BehaviorProfile, AuthenticationLog,
    RiskScore, Alert, AttackEvent, Prediction
)
from backend.services.feature_service import FeatureExtractionService
from backend.ml.pipeline import ml_pipeline
from backend.services.risk_service import RiskScoringEngine
from backend.services.attack_classifier_service import AttackClassificationService
from backend.services.explainability_service import ExplainabilityService
from backend.services.websocket_manager import ws_manager

class EventStreamingService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def process_auth_event(
        self,
        auth_log: AuthenticationLog,
        failed_count_1h: int = 0
    ) -> Dict[str, Any]:
        
        stmt_u = select(User).where(User.id == auth_log.user_id)
        user = (await self.session.execute(stmt_u)).scalar_one()

        stmt_d = select(Device).where(Device.id == auth_log.device_id)
        device = (await self.session.execute(stmt_d)).scalar_one()

        stmt_p = select(BehaviorProfile).where(BehaviorProfile.user_id == user.id)
        profile = (await self.session.execute(stmt_p)).scalar_one_or_none()

        features = FeatureExtractionService.extract_features(
            user=user,
            device=device,
            profile=profile,
            auth_log=auth_log,
            failed_count_1h=failed_count_1h
        )

        ml_res = ml_pipeline.predict(features)
        
        risk_val, risk_lvl, ml_conf, dev_score = RiskScoringEngine.calculate_risk(
            ml_prediction=ml_res,
            features=features,
            user_privilege=user.privilege_level
        )

        user.current_risk_score = risk_val
        auth_log.risk_score_value = risk_val

        attack_type, attack_conf = AttackClassificationService.classify(
            features=features,
            is_anomaly=ml_res["is_anomaly"],
            status=auth_log.status
        )

        explanation = ExplainabilityService.generate_explanation(
            attack_type=attack_type,
            risk_score=risk_val,
            features=features,
            country=auth_log.country,
            device_name=device.device_name,
            user_name=user.full_name
        )

        pred_record = Prediction(
            user_id=user.id,
            model_name=ml_res["model_name"],
            anomaly_score=ml_res["anomaly_score"],
            confidence_score=ml_res["confidence_score"],
            prediction_probability=ml_res["prediction_probability"],
            is_anomaly=ml_res["is_anomaly"],
            feature_vector=features
        )
        self.session.add(pred_record)

        risk_record = RiskScore(
            user_id=user.id,
            score=risk_val,
            level=risk_lvl,
            ml_confidence=ml_conf,
            behavior_deviation=dev_score,
            attack_indicators={"attack_type": attack_type, "confidence": attack_conf},
            explainability_notes=explanation
        )
        self.session.add(risk_record)
        await self.session.flush()

        created_alert_id = None
        if risk_lvl in ["High", "Critical"] or ml_res["is_anomaly"]:
            auth_log.is_flagged = True
            
            alert = Alert(
                user_id=user.id,
                event_type=attack_type,
                risk_score_id=risk_record.id,
                title=f"{attack_type} Detected - {user.full_name}",
                severity=risk_lvl if risk_lvl in ["High", "Critical"] else "Medium",
                status="Open",
                assigned_to="SOC Tier 1 Analyst",
                explanation=explanation
            )
            self.session.add(alert)
            await self.session.flush()
            created_alert_id = alert.id

            att_event = AttackEvent(
                alert_id=alert.id,
                user_id=user.id,
                attack_type=attack_type,
                confidence_score=attack_conf,
                details=explanation
            )
            self.session.add(att_event)

        event_payload = {
            "type": "NEW_AUTH_EVENT",
            "timestamp": auth_log.timestamp.isoformat() if auth_log.timestamp else datetime.now(timezone.utc).isoformat(),
            "user_id": user.id,
            "user_name": user.full_name,
            "user_email": user.email,
            "device_id": device.id,
            "device_name": device.device_name,
            "country": auth_log.country,
            "city": auth_log.city,
            "ip_address": auth_log.ip_address,
            "status": auth_log.status,
            "risk_score": risk_val,
            "risk_level": risk_lvl,
            "attack_type": attack_type,
            "is_anomaly": ml_res["is_anomaly"],
            "alert_id": created_alert_id,
            "explanation": explanation
        }

        await ws_manager.broadcast(event_payload)
        return event_payload
