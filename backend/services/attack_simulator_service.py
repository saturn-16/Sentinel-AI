import random
import uuid
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.models.entities import User, Device, AuthenticationLog, ActivityLog
from backend.services.streaming_service import EventStreamingService

class AttackSimulatorService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def simulate_attack(
        self,
        attack_type: str,
        target_user_id: Optional[str] = None,
        severity: str = "High",
        duration_hours: int = 1
    ) -> Dict[str, Any]:
        
        if not target_user_id:
            stmt = select(User).where(User.role != "Admin")
            users = (await self.session.execute(stmt)).scalars().all()
            if not users:
                stmt_all = select(User)
                users = (await self.session.execute(stmt_all)).scalars().all()
            user = random.choice(users)
        else:
            stmt = select(User).where(User.id == target_user_id)
            user = (await self.session.execute(stmt)).scalar_one_or_none()

        stmt_dev = select(Device).where(Device.user_id == user.id)
        devices = (await self.session.execute(stmt_dev)).scalars().all()
        
        if not devices:
            dev = Device(
                user_id=user.id,
                device_name="Unrecognized-Terminal",
                device_type="Unknown",
                os="Linux Kali 2024",
                browser="HeadlessChrome",
                mac_address="DE:AD:BE:EF:00:01",
                is_trusted=False,
                trust_score=15.0
            )
            self.session.add(dev)
            await self.session.flush()
        else:
            dev = devices[0]

        now = datetime.now(timezone.utc)
        streaming_service = EventStreamingService(self.session)
        
        generated_events = []

        if attack_type == "Brute Force":
            for i in range(7):
                auth_log = AuthenticationLog(
                    user_id=user.id,
                    device_id=dev.id,
                    timestamp=now - timedelta(minutes=(7 - i) * 2),
                    auth_method="Password Auth",
                    status="FAILED",
                    ip_address="185.220.101.45",
                    country="Germany",
                    city="Frankfurt",
                    user_agent="Python-requests/2.31.0",
                    is_flagged=True,
                    risk_score_value=88.5
                )
                self.session.add(auth_log)
                await self.session.flush()
                res = await streaming_service.process_auth_event(auth_log, failed_count_1h=i + 1)
                generated_events.append(res)

        elif attack_type == "Impossible Travel":
            auth_log1 = AuthenticationLog(
                user_id=user.id,
                device_id=dev.id,
                timestamp=now - timedelta(minutes=15),
                auth_method="SAML SSO",
                status="SUCCESS",
                ip_address="192.168.1.100",
                country="United States",
                city="New York",
                user_agent="Mozilla/5.0 (Windows NT 10.0)",
                is_flagged=False,
                risk_score_value=12.0
            )
            self.session.add(auth_log1)
            await self.session.flush()
            await streaming_service.process_auth_event(auth_log1, failed_count_1h=0)

            auth_log2 = AuthenticationLog(
                user_id=user.id,
                device_id=dev.id,
                timestamp=now,
                auth_method="Password Auth",
                status="SUCCESS",
                ip_address="91.240.118.12",
                country="Russia",
                city="Moscow",
                user_agent="Mozilla/5.0 (X11; Linux x86_64)",
                is_flagged=True,
                risk_score_value=94.0
            )
            self.session.add(auth_log2)
            await self.session.flush()
            res = await streaming_service.process_auth_event(auth_log2, failed_count_1h=0)
            generated_events.append(res)

        elif attack_type == "Privilege Escalation":
            auth_log = AuthenticationLog(
                user_id=user.id,
                device_id=dev.id,
                timestamp=now,
                auth_method="API Key",
                status="SUCCESS",
                ip_address="45.154.255.10",
                country="Unknown",
                city="Proxy",
                user_agent="curl/7.68.0",
                is_flagged=True,
                risk_score_value=91.0
            )
            self.session.add(auth_log)
            await self.session.flush()
            res = await streaming_service.process_auth_event(auth_log, failed_count_1h=1)
            generated_events.append(res)

        else:
            auth_log = AuthenticationLog(
                user_id=user.id,
                device_id=dev.id,
                timestamp=now,
                auth_method="Stolen Session Cookie",
                status="SUCCESS",
                ip_address="185.156.177.3",
                country="Netherlands",
                city="Amsterdam",
                user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
                is_flagged=True,
                risk_score_value=85.0
            )
            self.session.add(auth_log)
            await self.session.flush()
            res = await streaming_service.process_auth_event(auth_log, failed_count_1h=2)
            generated_events.append(res)

        await self.session.commit()

        return {
            "attack_type": attack_type,
            "target_user": user.full_name,
            "target_email": user.email,
            "severity": severity,
            "events_simulated": len(generated_events),
            "latest_event_summary": generated_events[-1] if generated_events else None,
            "status": f"Attack vector '{attack_type}' successfully injected into live event stream."
        }
