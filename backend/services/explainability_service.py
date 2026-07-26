from typing import Dict, Any, List

class ExplainabilityService:
    @staticmethod
    def generate_explanation(
        attack_type: str,
        risk_score: float,
        features: Dict[str, Any],
        country: str,
        device_name: str,
        user_name: str
    ) -> Dict[str, Any]:
        reasons: List[str] = []
        actions: List[str] = []

        if features.get("geo_velocity_kmh", 0) > 400.0:
            reasons.append(f"First login detected from {country} exhibiting impossible geographic velocity.")
            actions.append("Block foreign IP address and verify user location via out-of-band communication.")

        if features.get("new_device_flag", 0) == 1.0:
            reasons.append(f"Authentication initiated from un-registered device '{device_name}'.")
            actions.append("Revoke device authorization and prompt for hardware token MFA re-registration.")

        if features.get("login_hour_dev", 0) > 2.0:
            reasons.append("Authentication occurred significantly outside established working hours.")
            actions.append("Review recent user activity logs and confirm shift schedule with team manager.")

        if features.get("failed_login_count_1h", 0) >= 3:
            cnt = int(features.get("failed_login_count_1h"))
            reasons.append(f"Detected {cnt} consecutive failed authentication attempts in the past hour.")
            actions.append("Enforce immediate account lockout and trigger credential reset procedure.")

        if features.get("privilege_dev_flag", 0) == 1.0:
            reasons.append("Account possesses administrative privileges accessing high-impact resources.")
            actions.append("Isolate session, audit active API keys, and enforce step-up authentication.")

        if features.get("ip_reputation_score", 0) >= 40.0:
            reasons.append("Source IP address is categorized under suspicious or high-risk network ranges.")
            actions.append("Add IP range to SOC firewall watch list and inspect perimeter Gateway logs.")

        if not reasons:
            reasons.append("Statistical deviation detected across multi-factor baseline behavior indicators.")
            actions.append("Monitor account for 24 hours and verify session token integrity.")

        return {
            "risk_score": round(risk_score, 1),
            "attack_type": attack_type,
            "user_name": user_name,
            "reasons": reasons,
            "suggested_actions": actions,
            "summary_text": f"High risk event ({attack_type}) generated for {user_name} with risk score {round(risk_score, 1)}."
        }
