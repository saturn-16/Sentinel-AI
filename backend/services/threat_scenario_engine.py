import random
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.models.entities import User, Device, AuthenticationLog, Organization
from backend.data.attack_profiles import ATTACK_PROFILES, VPN_GATEWAYS, SERVICE_ACCOUNTS

class ThreatScenarioEngine:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def inject_threat_scenario(self, scenario_name: str, target_user_id: Optional[str] = None) -> AuthenticationLog:
        profile = ATTACK_PROFILES.get(scenario_name)
        if not profile:
            profile = ATTACK_PROFILES["Brute Force"]

        if target_user_id:
            user = await self.session.get(User, target_user_id)
        else:
            stmt = select(User).limit(50)
            users = (await self.session.execute(stmt)).scalars().all()
            user = random.choice(users) if users else None

        if not user:
            raise ValueError("No target user found for threat scenario injection.")

        stmt_dev = select(Device).where(Device.user_id == user.id)
        devices = (await self.session.execute(stmt_dev)).scalars().all()
        device = random.choice(devices) if devices else None

        ip_addr = random.choice(profile["ip_pool"])
        country = random.choice(profile["countries"])
        city = "Frankfurt" if country == "Germany" else ("Moscow" if country == "Russia" else "New York")
        user_agent = random.choice(profile["user_agents"])
        
        status = "Success" if scenario_name in ["Impossible Travel", "Insider Threat", "Lateral Movement"] else "Failure"
        
        auth_log = AuthenticationLog(
            user_id=user.id,
            device_id=device.id if device else None,
            timestamp=datetime.now(timezone.utc),
            auth_method="Password" if profile["is_tor"] else ("VPN" if profile["is_vpn"] else "SSO"),
            status=status,
            ip_address=ip_addr,
            country=country,
            city=city,
            user_agent=user_agent,
            is_flagged=False,
            risk_score_value=0.0
        )

        self.session.add(auth_log)
        await self.session.commit()
        await self.session.refresh(auth_log)
        return auth_log
