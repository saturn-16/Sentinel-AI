import math
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from backend.models.entities import User, Device, BehaviorProfile, AuthenticationLog

class FeatureExtractionService:
    @staticmethod
    def extract_features(
        user: User,
        device: Device,
        profile: Optional[BehaviorProfile],
        auth_log: AuthenticationLog,
        failed_count_1h: int = 0
    ) -> Dict[str, Any]:
        
        log_time = auth_log.timestamp if auth_log.timestamp else datetime.now(timezone.utc)
        hour = log_time.hour
        
        login_hour_dev = 0.0
        if profile and profile.normal_login_hours:
            allowed_hours = profile.normal_login_hours.get("hours", [8, 9, 10, 11, 12, 13, 14, 15, 16, 17])
            if hour not in allowed_hours:
                min_dist = min([abs(hour - h) for h in allowed_hours])
                login_hour_dev = float(min_dist)
        else:
            if hour < 7 or hour > 19:
                login_hour_dev = float(min(abs(hour - 7), abs(hour - 19)))

        new_device_flag = 0.0 if device.is_trusted else 1.0
        
        geo_velocity_kmh = 0.0
        if profile and profile.normal_countries:
            normal_c = profile.normal_countries.get("countries", ["United States"])
            if auth_log.country not in normal_c:
                geo_velocity_kmh = 850.0

        auth_freq_delta = float(failed_count_1h) * 1.5
        device_trust_score = float(device.trust_score)
        
        session_dev_hours = 0.0
        resource_rarity_score = 0.1
        failed_login_count_1h = float(failed_count_1h)
        
        ip_rep = 0.0
        if auth_log.country in ["Unknown", "Anonymous Proxy", "TOR Exit Node", "North Korea", "Iran"]:
            ip_rep = 85.0
        elif auth_log.country not in ["United States", "United Kingdom", "Germany", "India", "Canada", "France", "Japan"]:
            ip_rep = 40.0

        privilege_dev = 1.0 if user.privilege_level in ["Admin", "Executive", "Domain Admin"] else 0.0
        hist_anomaly_rate = max(0.0, (user.current_risk_score - 10.0) / 90.0)
        consistency_score = profile.behavior_consistency_score if profile else 90.0

        return {
            "login_hour_dev": round(login_hour_dev, 2),
            "new_device_flag": new_device_flag,
            "geo_velocity_kmh": round(geo_velocity_kmh, 2),
            "auth_freq_delta": round(auth_freq_delta, 2),
            "device_trust_score": round(device_trust_score, 2),
            "session_dev_hours": round(session_dev_hours, 2),
            "resource_rarity_score": round(resource_rarity_score, 2),
            "failed_login_count_1h": failed_login_count_1h,
            "ip_reputation_score": round(ip_rep, 2),
            "privilege_dev_flag": privilege_dev,
            "hist_anomaly_rate": round(hist_anomaly_rate, 4),
            "behavior_consistency_score": round(consistency_score, 2)
        }
