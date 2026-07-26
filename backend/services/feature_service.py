import math
from datetime import datetime, timezone
from typing import Dict, Any, Optional, List, Tuple
from backend.models.entities import User, Device, BehaviorProfile, AuthenticationLog
from backend.data.attack_profiles import ATTACK_PROFILES

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
        weekday = log_time.weekday()
        
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
        if auth_log.country in ["Unknown", "Anonymous Proxy", "TOR Exit Node", "Russia", "North Korea", "Iran"]:
            ip_rep = 85.0
        elif auth_log.country not in ["United States", "United Kingdom", "Germany", "India", "Canada", "France", "Japan"]:
            ip_rep = 40.0

        privilege_dev = 1.0 if user.privilege_level in ["Admin", "Executive", "Domain Admin"] else 0.0
        hist_anomaly_rate = max(0.0, (user.current_risk_score - 10.0) / 90.0)
        consistency_score = profile.behavior_consistency_score if profile else 90.0

        weekday_dev = 1.0 if weekday in [5, 6] else 0.0
        holiday_login_flag = 0.0
        office_closed_flag = 1.0 if hour < 6 or hour > 22 else 0.0
        vpn_gateway_dev = 1.0 if auth_log.auth_method == "VPN" and "honeywell" not in auth_log.user_agent.lower() else 0.0
        asn_reputation_score = 75.0 if ip_rep > 50.0 else 10.0
        tor_usage_flag = 1.0 if "TOR" in auth_log.user_agent or auth_log.country == "Anonymous Proxy" else 0.0
        proxy_detection_flag = 1.0 if "Proxy" in auth_log.user_agent else 0.0
        browser_fp_dev = 1.0 if "Python" in auth_log.user_agent or "Hydra" in auth_log.user_agent else 0.0
        device_mismatch_flag = 1.0 if not device.is_trusted else 0.0
        mfa_bypass_indicator = 1.0 if failed_count_1h > 5 and auth_log.status == "Success" else 0.0
        simultaneous_logins_count = 2.0 if geo_velocity_kmh > 500.0 else 0.0
        service_account_dev_flag = 1.0 if user.email.startswith("svc-") and hour not in [0, 1, 2, 3, 4] else 0.0

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
            "behavior_consistency_score": round(consistency_score, 2),
            "weekday_dev": weekday_dev,
            "holiday_login_flag": holiday_login_flag,
            "office_closed_flag": office_closed_flag,
            "vpn_gateway_dev": vpn_gateway_dev,
            "asn_reputation_score": round(asn_reputation_score, 2),
            "tor_usage_flag": tor_usage_flag,
            "proxy_detection_flag": proxy_detection_flag,
            "browser_fp_dev": browser_fp_dev,
            "device_mismatch_flag": device_mismatch_flag,
            "mfa_bypass_indicator": mfa_bypass_indicator,
            "simultaneous_logins_count": simultaneous_logins_count,
            "service_account_dev_flag": service_account_dev_flag
        }

    @staticmethod
    def calculate_feature_importance(features: Dict[str, Any]) -> List[Dict[str, Any]]:
        weights = {
            "geo_velocity_kmh": 25.0 if features.get("geo_velocity_kmh", 0) > 300 else 0,
            "failed_login_count_1h": min(30.0, features.get("failed_login_count_1h", 0) * 5.0),
            "new_device_flag": 20.0 if features.get("new_device_flag", 0) > 0 else 0,
            "tor_usage_flag": 30.0 if features.get("tor_usage_flag", 0) > 0 else 0,
            "mfa_bypass_indicator": 35.0 if features.get("mfa_bypass_indicator", 0) > 0 else 0,
            "login_hour_dev": min(15.0, features.get("login_hour_dev", 0) * 2.5),
            "privilege_dev_flag": 15.0 if features.get("privilege_dev_flag", 0) > 0 else 0,
            "ip_reputation_score": min(20.0, features.get("ip_reputation_score", 0) * 0.25)
        }
        
        total_score = sum(weights.values())
        if total_score == 0:
            return [{"feature": "Baseline Consistency", "percentage": 100, "description": "Normal behavioral variance"}]
        
        contributions = []
        for feat, val in weights.items():
            if val > 0:
                pct = round((val / total_score) * 100)
                readable = feat.replace("_", " ").title()
                contributions.append({"feature": readable, "percentage": pct, "description": f"Contributed {pct}% to anomaly risk"})

        contributions.sort(key=lambda x: x["percentage"], reverse=True)
        return contributions[:4]
