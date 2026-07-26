import os
import yaml
from typing import Dict, Any, Tuple

def load_risk_policy() -> Dict[str, Any]:
    policy_path = os.path.join(os.path.dirname(__file__), "..", "config", "risk_policy.yaml")
    if os.path.exists(policy_path):
        try:
            with open(policy_path, "r") as f:
                return yaml.safe_load(f) or {}
        except Exception:
            pass
    return {
        "scoring_policy": {"ml_weight": 0.55, "behavior_weight": 0.45},
        "privilege_multipliers": {"Admin": 1.25, "Executive": 1.20, "Elevated": 1.10, "Standard": 1.0},
        "risk_thresholds": {"critical": 85.0, "high": 70.0, "medium": 35.0, "low": 0.0}
    }

class RiskScoringEngine:
    @staticmethod
    def calculate_risk(
        ml_prediction: Dict[str, Any],
        features: Dict[str, Any],
        user_privilege: str = "Standard"
    ) -> Tuple[float, str, float, float]:
        
        policy = load_risk_policy()
        scoring_p = policy.get("scoring_policy", {})
        priv_p = policy.get("privilege_multipliers", {})
        thresh_p = policy.get("risk_thresholds", {})

        ml_anomaly_prob = ml_prediction.get("prediction_probability", 0.1)
        ml_conf = ml_prediction.get("confidence_score", 80.0) / 100.0
        
        base_ml_component = ml_anomaly_prob * (scoring_p.get("ml_weight", 0.55) * 100.0)
        
        dev_hour = min(features.get("login_hour_dev", 0.0) * 4.0, 20.0)
        dev_new_dev = features.get("new_device_flag", 0.0) * 15.0
        dev_geo = min(features.get("geo_velocity_kmh", 0.0) / 40.0, 20.0)
        dev_failed = min(features.get("failed_login_count_1h", 0.0) * 6.0, 25.0)
        dev_ip = features.get("ip_reputation_score", 0.0) * 0.2
        
        behavior_deviation = float(dev_hour + dev_new_dev + dev_geo + dev_failed + dev_ip)
        behavior_component = min(behavior_deviation, (scoring_p.get("behavior_weight", 0.45) * 100.0))
        
        privilege_multiplier = priv_p.get(user_privilege, 1.0)
            
        raw_score = (base_ml_component + behavior_component) * privilege_multiplier
        final_score = float(min(max(raw_score, 5.0), 100.0))
        
        crit_t = thresh_p.get("critical", 85.0)
        high_t = thresh_p.get("high", 70.0)
        med_t = thresh_p.get("medium", 35.0)

        if final_score >= crit_t:
            level = "Critical"
        elif final_score >= high_t:
            level = "High"
        elif final_score >= med_t:
            level = "Medium"
        else:
            level = "Low"
            
        return round(final_score, 1), level, round(ml_conf * 100.0, 1), round(behavior_deviation, 1)
