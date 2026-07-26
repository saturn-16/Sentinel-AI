from typing import Dict, Any, List

DEPARTMENTS_LIST = [
    "Engineering", "SOC", "HR", "Finance", "Operations",
    "IT", "Executive", "Sales", "Legal"
]

OFFICE_LOCATIONS = {
    "HQ-NYC": {"city": "New York", "country": "United States", "timezone": "America/New_York"},
    "HQ-LON": {"city": "London", "country": "United Kingdom", "timezone": "Europe/London"},
    "HQ-BLR": {"city": "Bengaluru", "country": "India", "timezone": "Asia/Kolkata"},
    "HUB-FRA": {"city": "Frankfurt", "country": "Germany", "timezone": "Europe/Berlin"},
    "HUB-TYO": {"city": "Tokyo", "country": "Japan", "timezone": "Asia/Tokyo"},
    "HUB-TOR": {"city": "Toronto", "country": "Canada", "timezone": "America/Toronto"}
}

VPN_GATEWAYS = [
    "VPN-US-EAST.honeywell.com",
    "VPN-US-WEST.honeywell.com",
    "VPN-EUR-FRA.honeywell.com",
    "VPN-APAC-BLR.honeywell.com"
]

SERVICE_ACCOUNTS = [
    "svc-k8s-cluster",
    "svc-sql-sync",
    "svc-backup-prod",
    "svc-okta-connector",
    "svc-crowdstrike-agent"
]

NORMAL_USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0",
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:122.0) Gecko/20100101 Firefox/122.0"
]

ATTACK_PROFILES: Dict[str, Dict[str, Any]] = {
    "Brute Force": {
        "ip_pool": ["185.220.101.45", "185.220.101.46", "194.26.29.112"],
        "countries": ["Germany", "Romania"],
        "user_agents": ["Python-requests/2.31.0", "Hydra/v9.5", "Medusa/2.2"],
        "attacker_tools": ["THC-Hydra", "Medusa", "Custom Python Script"],
        "failure_count_range": [6, 15],
        "is_tor": False,
        "is_vpn": True
    },
    "Password Spray": {
        "ip_pool": ["45.154.255.10", "45.154.255.12", "185.156.177.3"],
        "countries": ["Netherlands", "Sweden"],
        "user_agents": ["Mozilla/5.0 (Windows NT 10.0; Win64; x64)", "Ruler/1.0"],
        "attacker_tools": ["DomainPasswordSpray", "MSOLSpray"],
        "failure_count_range": [3, 5],
        "is_tor": False,
        "is_vpn": True
    },
    "Credential Stuffing": {
        "ip_pool": ["194.26.29.100", "194.26.29.105", "185.220.102.8"],
        "countries": ["Russia", "Ukraine"],
        "user_agents": ["SentryMBA/2.1", "OpenBullet/1.4.4"],
        "attacker_tools": ["OpenBullet", "SentryMBA"],
        "failure_count_range": [4, 8],
        "is_tor": True,
        "is_vpn": False
    },
    "Impossible Travel": {
        "ip_pool": ["91.240.118.12", "91.240.118.15"],
        "countries": ["Russia", "China"],
        "user_agents": ["Mozilla/5.0 (X11; Linux x86_64)"],
        "attacker_tools": ["Stolen Cookie Session Hijack"],
        "failure_count_range": [0, 1],
        "is_tor": False,
        "is_vpn": True
    },
    "VPN Hijack": {
        "ip_pool": ["185.156.177.50"],
        "countries": ["Panama"],
        "user_agents": ["OpenVPN-Client/2.5.4"],
        "attacker_tools": ["Stolen OpenVPN Profile"],
        "failure_count_range": [1, 2],
        "is_tor": False,
        "is_vpn": True
    },
    "Insider Threat": {
        "ip_pool": ["192.168.1.188"],
        "countries": ["United States"],
        "user_agents": ["Mozilla/5.0 (Windows NT 10.0; Win64; x64)"],
        "attacker_tools": ["Authorized Internal Workstation"],
        "failure_count_range": [0, 0],
        "is_tor": False,
        "is_vpn": False
    },
    "Privilege Escalation": {
        "ip_pool": ["45.154.255.99"],
        "countries": ["Unknown Proxy"],
        "user_agents": ["curl/7.68.0", "Impacket/secretsdump"],
        "attacker_tools": ["Impacket", "Mimikatz", "BloodHound"],
        "failure_count_range": [1, 3],
        "is_tor": True,
        "is_vpn": False
    },
    "Lateral Movement": {
        "ip_pool": ["10.0.4.50"],
        "countries": ["United States"],
        "user_agents": ["psexec/v2.3", "WMI-Runner"],
        "attacker_tools": ["PsExec", "WMIC", "WinRM"],
        "failure_count_range": [0, 2],
        "is_tor": False,
        "is_vpn": False
    },
    "Service Account Abuse": {
        "ip_pool": ["194.26.29.200"],
        "countries": ["Bulgaria"],
        "user_agents": ["Python/3.11 aiohttp"],
        "attacker_tools": ["Stolen API Token"],
        "failure_count_range": [1, 2],
        "is_tor": False,
        "is_vpn": True
    },
    "Kerberoasting": {
        "ip_pool": ["10.0.2.115"],
        "countries": ["United States"],
        "user_agents": ["Rubeus/v2.0"],
        "attacker_tools": ["Rubeus", "GetUserSPNs.py"],
        "failure_count_range": [0, 1],
        "is_tor": False,
        "is_vpn": False
    }
}
