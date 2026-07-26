from typing import Dict, Any, Tuple

class AttackClassificationService:
    @staticmethod
    def classify(features: Dict[str, Any], is_anomaly: bool, status: str) -> Tuple[str, float]:
        if not is_anomaly:
            return "Normal Activity", 0.15
        
        failed_cnt = features.get("failed_login_count_1h", 0)
        new_dev = features.get("new_device_flag", 0)
        geo_vel = features.get("geo_velocity_kmh", 0)
        login_hour_dev = features.get("login_hour_dev", 0)
        priv_dev = features.get("privilege_dev_flag", 0)
        ip_rep = features.get("ip_reputation_score", 0)
        trust_score = features.get("device_trust_score", 100)

        if failed_cnt >= 5 and status == "FAILED":
            return "Brute Force", 0.94

        if failed_cnt >= 3 and new_dev == 1.0 and ip_rep >= 40.0:
            return "Credential Stuffing", 0.91

        if geo_vel >= 500.0:
            return "Impossible Travel", 0.96

        if new_dev == 1.0 and trust_score < 50.0:
            return "Device Spoofing", 0.88

        if priv_dev == 1.0 and (login_hour_dev > 3.0 or new_dev == 1.0):
            return "Privilege Escalation", 0.92

        if login_hour_dev > 4.0 and features.get("resource_rarity_score", 0) > 0.6:
            return "Insider Threat", 0.85

        if login_hour_dev > 3.0 and priv_dev == 1.0:
            return "Lateral Movement", 0.87

        if features.get("session_dev_hours", 0) > 5.0:
            return "Slow Data Exfiltration", 0.83

        return "Unknown Anomaly", 0.70
