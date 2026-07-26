import random
import uuid
from datetime import datetime, timedelta, timezone
from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from backend.models.entities import (
    Organization, User, Device, AuthenticationLog, ActivityLog,
    BehaviorProfile, RiskScore, Alert, Incident, Prediction
)
from backend.security.auth import get_password_hash
from backend.data.attack_profiles import DEPARTMENTS_LIST, OFFICE_LOCATIONS, VPN_GATEWAYS, SERVICE_ACCOUNTS, NORMAL_USER_AGENTS

ROLES = ["SOC Analyst", "Software Engineer", "DevOps Specialist", "Financial Analyst", "System Admin", "HR Specialist", "Sales Lead", "Legal Counsel"]
PRIVILEGES = ["Standard", "Standard", "Standard", "Elevated", "Admin", "Executive"]
WORK_PATTERNS = ["Standard Business Hours", "Shift Worker (24/7)", "Remote Employee", "Hybrid Worker"]
RESOURCES = ["/api/v1/auth/login", "/api/v1/finance/reports", "/api/v1/k8s/cluster", "/api/v1/database/export", "/api/v1/admin/users", "/api/v1/source/repo"]

class SyntheticDataGenerator:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def generate_enterprise_environment(self, num_users: int = 50, num_days: int = 5) -> Dict[str, Any]:
        stmt = select(Organization).where(Organization.domain == "honeywell.com")
        res = await self.session.execute(stmt)
        org = res.scalar_one_or_none()
        
        if not org:
            org = Organization(
                name="Honeywell International Inc.",
                domain="honeywell.com",
                industry="Aerospace & Enterprise Security"
            )
            self.session.add(org)
            await self.session.flush()

        stmt_admin = select(User).where(User.email == "admin@honeywell.com")
        res_admin = await self.session.execute(stmt_admin)
        admin_user = res_admin.scalar_one_or_none()
        
        if not admin_user:
            admin_user = User(
                organization_id=org.id,
                email="admin@honeywell.com",
                hashed_password=get_password_hash("SentinelPass2026!"),
                full_name="Global Security Admin",
                role="Admin",
                department="Security Operations",
                privilege_level="Admin",
                work_pattern="Standard Business Hours",
                is_active=True,
                current_risk_score=12.0
            )
            self.session.add(admin_user)
            await self.session.flush()

        created_users: List[User] = [admin_user]
        
        for i in range(1, num_users):
            email = f"user{i}@honeywell.com"
            stmt_u = select(User).where(User.email == email)
            r_u = await self.session.execute(stmt_u)
            existing = r_u.scalar_one_or_none()
            
            dept = DEPARTMENTS_LIST[i % len(DEPARTMENTS_LIST)]
            if not existing:
                u = User(
                    organization_id=org.id,
                    email=email,
                    hashed_password=get_password_hash("Honeywell2026!"),
                    full_name=f"Enterprise Employee {i}",
                    role=random.choice(ROLES),
                    department=dept,
                    privilege_level=random.choice(PRIVILEGES),
                    work_pattern=random.choice(WORK_PATTERNS),
                    is_active=True,
                    current_risk_score=round(random.uniform(8.0, 25.0), 1)
                )
                self.session.add(u)
                created_users.append(u)
            else:
                created_users.append(existing)

        await self.session.flush()

        devices: List[Device] = []
        for idx, u in enumerate(created_users):
            stmt_d = select(Device).where(Device.user_id == u.id)
            d_list = (await self.session.execute(stmt_d)).scalars().all()
            if not d_list:
                dept_code = u.department[:3].upper()
                dev_name = f"{dept_code}-LAP-{100 + idx}"
                d = Device(
                    user_id=u.id,
                    device_name=dev_name,
                    device_type="Workstation",
                    os="Windows 11 Enterprise",
                    browser="Chrome 122.0",
                    mac_address=f"00:1A:2B:{random.randint(10,99)}:{random.randint(10,99)}:{random.randint(10,99)}",
                    is_trusted=True,
                    trust_score=round(random.uniform(90.0, 99.0), 1)
                )
                self.session.add(d)
                devices.append(d)
            else:
                devices.extend(d_list)

        await self.session.flush()

        for u in created_users:
            stmt_p = select(BehaviorProfile).where(BehaviorProfile.user_id == u.id)
            p_exist = (await self.session.execute(stmt_p)).scalar_one_or_none()
            if not p_exist:
                p = BehaviorProfile(
                    user_id=u.id,
                    normal_login_hours={"hours": [8, 9, 10, 11, 12, 13, 14, 15, 16, 17]},
                    normal_countries={"countries": ["United States", "United Kingdom", "Germany", "India"]},
                    normal_devices={"device_ids": [d.id for d in devices if d.user_id == u.id]},
                    normal_ip_ranges={"ips": ["192.168.1.0/24", "10.0.0.0/16"]},
                    auth_frequency_avg=4.5,
                    session_duration_avg=28800.0,
                    common_resources={"resources": ["/api/v1/auth/login", "/api/v1/dashboard"]},
                    privilege_usage={"privilege": u.privilege_level},
                    frequent_commands={"commands": ["kubectl get pods", "git pull", "python main.py"]},
                    behavior_consistency_score=94.5
                )
                self.session.add(p)

        await self.session.flush()

        now = datetime.now(timezone.utc)
        auth_logs_count = 0
        
        for u in created_users:
            u_devices = [d for d in devices if d.user_id == u.id]
            if not u_devices:
                continue
            dev = u_devices[0]
            
            for day_offset in range(num_days, 0, -1):
                day_time = now - timedelta(days=day_offset)
                if day_time.weekday() in [5, 6] and u.work_pattern != "Shift Worker (24/7)":
                    if random.random() > 0.15:
                        continue
                
                login_hour = random.randint(8, 10) if u.work_pattern != "Shift Worker (24/7)" else random.randint(0, 23)
                login_timestamp = day_time.replace(hour=login_hour, minute=random.randint(0, 59))
                
                c = random.choice(["United States", "United Kingdom", "Germany", "India"])
                ci = "New York" if c == "United States" else ("London" if c == "United Kingdom" else ("Frankfurt" if c == "Germany" else "Bengaluru"))
                
                auth_log = AuthenticationLog(
                    user_id=u.id,
                    device_id=dev.id,
                    timestamp=login_timestamp,
                    auth_method="SAML SSO + MFA",
                    status="SUCCESS",
                    ip_address=f"192.168.{random.randint(1,10)}.{random.randint(2,254)}",
                    country=c,
                    city=ci,
                    user_agent=random.choice(NORMAL_USER_AGENTS),
                    is_flagged=False,
                    risk_score_value=0.0
                )
                self.session.add(auth_log)
                auth_logs_count += 1

        await self.session.commit()

        return {
            "organization": org.name,
            "users_count": len(created_users),
            "devices_count": len(devices),
            "auth_logs_generated": auth_logs_count,
            "status": "Enterprise dataset generated successfully."
        }
