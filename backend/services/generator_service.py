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

DEPARTMENTS = ["Security Operations", "Software Engineering", "Cloud Infrastructure", "Finance & HR", "Executive Leadership", "Supply Chain"]
ROLES = ["SOC Analyst", "Software Engineer", "DevOps Specialist", "Financial Analyst", "System Admin", "Viewer"]
PRIVILEGES = ["Standard", "Standard", "Standard", "Elevated", "Admin", "Executive"]
WORK_PATTERNS = ["Standard Business Hours", "Shift Worker (24/7)", "Remote Employee", "Hybrid Worker"]
COUNTRIES = ["United States", "United Kingdom", "Germany", "India", "Canada", "France", "Japan"]
CITIES = {
    "United States": ["New York", "San Francisco", "Austin", "Seattle", "Chicago"],
    "United Kingdom": ["London", "Manchester", "Edinburgh"],
    "Germany": ["Berlin", "Munich", "Frankfurt"],
    "India": ["Bengaluru", "Hyderabad", "Mumbai", "Pune"],
    "Canada": ["Toronto", "Vancouver"],
    "France": ["Paris", "Lyon"],
    "Japan": ["Tokyo", "Osaka"]
}
OS_LIST = ["Windows 11 Enterprise", "macOS Sonoma", "Ubuntu 22.04 LTS", "iOS 17", "Android 14"]
BROWSERS = ["Chrome 122.0", "Edge 121.0", "Safari 17.2", "Firefox 123.0"]
RESOURCES = ["/api/v1/auth/login", "/api/v1/finance/reports", "/api/v1/k8s/cluster", "/api/v1/database/export", "/api/v1/admin/users", "/api/v1/source/repo"]

class SyntheticDataGenerator:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def generate_enterprise_environment(self, num_users: int = 40, num_days: int = 5) -> Dict[str, Any]:
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
            
            if not existing:
                u = User(
                    organization_id=org.id,
                    email=email,
                    hashed_password=get_password_hash("Honeywell2026!"),
                    full_name=f"Enterprise Employee {i}",
                    role=random.choice(ROLES),
                    department=random.choice(DEPARTMENTS),
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
        for u in created_users:
            stmt_d = select(Device).where(Device.user_id == u.id)
            d_list = (await self.session.execute(stmt_d)).scalars().all()
            if not d_list:
                d = Device(
                    user_id=u.id,
                    device_name=f"{u.full_name.replace(' ', '-')}-Workstation",
                    device_type="Laptop",
                    os=random.choice(OS_LIST),
                    browser=random.choice(BROWSERS),
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
                    normal_countries={"countries": ["United States", "India", "Germany"]},
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
                
                c = random.choice(["United States", "India", "Germany"])
                ci = random.choice(CITIES[c])
                
                auth_log = AuthenticationLog(
                    user_id=u.id,
                    device_id=dev.id,
                    timestamp=login_timestamp,
                    auth_method="SAML SSO + MFA",
                    status="SUCCESS",
                    ip_address=f"192.168.{random.randint(1,10)}.{random.randint(2,254)}",
                    country=c,
                    city=ci,
                    user_agent=f"Mozilla/5.0 ({dev.os}) {dev.browser}",
                    is_flagged=False,
                    risk_score_value=round(random.uniform(5.0, 18.0), 1)
                )
                self.session.add(auth_log)
                auth_logs_count += 1
                
                act_log = ActivityLog(
                    user_id=u.id,
                    device_id=dev.id,
                    timestamp=login_timestamp + timedelta(minutes=5),
                    resource_accessed=random.choice(RESOURCES),
                    action_type="READ",
                    command_executed="kubectl get pods",
                    session_id=str(uuid.uuid4()),
                    duration_seconds=random.randint(300, 28800),
                    bytes_transferred=random.randint(2048, 500000)
                )
                self.session.add(act_log)

        await self.session.commit()

        return {
            "organization": org.name,
            "users_count": len(created_users),
            "devices_count": len(devices),
            "auth_logs_generated": auth_logs_count,
            "status": "Enterprise dataset generated successfully."
        }
