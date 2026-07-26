from typing import Dict, Any

class MitreAttackMapper:
    MAPPINGS: Dict[str, Dict[str, str]] = {
        "Brute Force": {
            "tactic": "TA0006 - Credential Access",
            "technique": "Brute Force",
            "technique_id": "T1110",
            "description": "Adversaries may attempt to gain access to accounts by systematically guessing passwords or attempting multi-factor bypass iterations."
        },
        "Credential Stuffing": {
            "tactic": "TA0006 - Credential Access",
            "technique": "Credential Stuffing",
            "technique_id": "T1110.004",
            "description": "Adversaries may use credentials obtained from prior data breaches across unrelated external services to attempt unauthorized access."
        },
        "Impossible Travel": {
            "tactic": "TA0001 - Initial Access",
            "technique": "Valid Accounts",
            "technique_id": "T1078",
            "description": "Adversaries obtain valid credentials and authenticate from geographically impossible physical distances in unrealistically short timeframes."
        },
        "Device Spoofing": {
            "tactic": "TA0005 - Defense Evasion",
            "technique": "Masquerading",
            "technique_id": "T1036",
            "description": "Adversaries spoof hardware MAC addresses, user agent strings, or OS fingerprints to bypass perimeter device-trust policies."
        },
        "Privilege Escalation": {
            "tactic": "TA0004 - Privilege Escalation",
            "technique": "Exploitation for Privilege Escalation",
            "technique_id": "T1068",
            "description": "Adversaries exploit software vulnerabilities or administrative token misconfigurations to elevate user privileges to domain admin."
        },
        "Lateral Movement": {
            "tactic": "TA0008 - Lateral Movement",
            "technique": "Remote Services",
            "technique_id": "T1021",
            "description": "Adversaries pivot between internal subnet assets and high-value servers using compromised secondary user credentials."
        },
        "Insider Threat": {
            "tactic": "TA0010 - Exfiltration",
            "technique": "Exfiltration Over Alternative Protocol",
            "technique_id": "T1048",
            "description": "Authorized internal accounts or malicious insiders access sensitive code repositories or databases outside normal business baseline hours."
        },
        "Slow Data Exfiltration": {
            "tactic": "TA0010 - Exfiltration",
            "technique": "Data Transfer Size Limits",
            "technique_id": "T1030",
            "description": "Adversaries exfiltrate data in small, delayed bandwidth chunks to evade threshold-based volumetric network monitoring rules."
        }
    }

    @classmethod
    def get_mapping(cls, attack_type: str) -> Dict[str, str]:
        return cls.MAPPINGS.get(attack_type, {
            "tactic": "TA0007 - Discovery",
            "technique": "System Information Discovery",
            "technique_id": "T1082",
            "description": "Statistical anomaly detected across behavioral baseline parameters."
        })
