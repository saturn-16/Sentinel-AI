from typing import Dict, Any, Tuple

class RiskScoringEngine:
    @staticmethod
    def calculate_risk(
        ml_prediction: Dict[str, Any],
        features: Dict[str, Any],
        user_privilege: str = "Standard"
    ) -> Tuple[float, str, float, float]:
        
        ml_anomaly_prob = ml_prediction.get("prediction_probability", 0.1)
        ml_conf = ml_prediction.get("confidence_score", 80.0) / 100.0
        
        base_ml_component = ml_anomaly_prob * 45.0
        
        dev_hour = min(features.get("login_hour_dev", 0.0) * 4.0, 20.0)
        dev_new_dev = features.get("new_device_flag", 0.0) * 15.0
        dev_geo = min(features.get("geo_velocity_kmh", 0.0) / 40.0, 20.0)
        dev_failed = min(features.get("failed_login_count_1h", 0.0) * 6.0, 25.0)
        dev_ip = features.get("ip_reputation_score", 0.0) * 0.2
        
        behavior_deviation = float(dev_hour + dev_new_dev + dev_geo + dev_failed + dev_ip)
        behavior_component = min(behavior_deviation, 45.0)
        
        privilege_multiplier = 1.0
        if user_privilege in ["Admin", "Executive", "Domain Admin"]:
            privilege_multiplier = 1.25
        elif user_privilege == "Elevated":
            privilege_multiplier = 1.10
            
        raw_score = (base_ml_component + behavior_component) * privilege_multiplier
        final_score = float(min(max(raw_score, 5.0), 100.0))
        
        if final_score >= 85.0:
            level = "Critical"
        elif final_score >= 70.0:
            level = "High"
        elif final_score >= 35.0:
            level = "Medium"
        else:
            level = "Low"
            
        return round(final_score, 1), level, round(ml_conf * 100.0, 1), round(behavior_deviation, 1)
