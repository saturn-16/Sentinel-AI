# SentinelAI - Enterprise AI Behavioral Anomaly Detection & SOC Platform

Developed for **Honeywell Hackathon 2026**.

SentinelAI is an enterprise-grade, real-time Security Operations Center (SOC) platform powered by ensemble Machine Learning models (**Isolation Forest + One-Class SVM**). It learns normal employee baseline behavior from authentication and activity logs, detects anomalous access patterns in real time, classifies attack vectors, maps threats to the **MITRE ATT&CK Framework**, generates explainable 0-100 risk scores, and streams live security alerts via WebSockets.

---

## 🏛️ System Architecture

```
[ Enterprise User & Auth Logs ]
              │
              ▼
  [ Feature Extraction Engine ]  (12-dimensional vector)
              │
              ▼
   [ Ensemble ML Pipeline ]     (Isolation Forest + One-Class SVM)
              │
              ▼
    [ Risk Scoring Engine ]     (Normalized 0-100 score)
              │
              ▼
  [ MITRE ATT&CK & Explain ]    (Tactic/Technique mapping + plain language)
              │
              ▼
   [ Real-Time Stream & WS ]    (Postgres DB persistence & WebSocket broadcast)
              │
              ▼
   [ React 18 SOC Dashboard ]   (Enterprise dark UI with real-time stream)
```

---

## 🛡️ MITRE ATT&CK Framework Mapping

| Detected Attack Vector | MITRE Tactic | Technique Name | Technique ID |
| :--- | :--- | :--- | :--- |
| **Brute Force** | `TA0006 - Credential Access` | Brute Force | `T1110` |
| **Credential Stuffing** | `TA0006 - Credential Access` | Credential Stuffing | `T1110.004` |
| **Impossible Travel** | `TA0001 - Initial Access` | Valid Accounts | `T1078` |
| **Device Spoofing** | `TA0005 - Defense Evasion` | Masquerading | `T1036` |
| **Privilege Escalation** | `TA0004 - Privilege Escalation` | Exploitation for Privilege Escalation | `T1068` |
| **Lateral Movement** | `TA0008 - Lateral Movement` | Remote Services | `T1021` |
| **Insider Threat** | `TA0010 - Exfiltration` | Exfiltration Over Alternative Protocol | `T1048` |
| **Slow Data Exfiltration** | `TA0010 - Exfiltration` | Data Transfer Size Limits | `T1030` |

---

## 📁 Repository Structure

```
honeywell/
├── backend/
│   ├── api/v1/          # FastApi REST endpoints & WebSockets
│   ├── core/            # Config, Async DB Engine, Exceptions
│   ├── database/        # Async session factory
│   ├── generator/       # Synthetic log engine & attack simulators
│   ├── ml/              # Isolation Forest & One-Class SVM pipeline
│   ├── models/          # SQLAlchemy ORM entities
│   ├── repositories/    # Async CRUD repository layer
│   ├── schemas/         # Pydantic v2 DTOs
│   ├── security/        # JWT auth, Bcrypt hashing, RBAC
│   ├── services/        # Business logic & MITRE ATT&CK mapper
│   ├── tests/           # Pytest test suite
│   └── main.py          # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Layout, Charts, Common UI elements
│   │   ├── pages/       # Dashboard, Executive, LiveStream, Alerts, etc.
│   │   ├── services/    # Axios API & WebSocket client
│   │   ├── store/       # Zustand state management
│   │   └── types/       # TypeScript DTO interfaces
├── docs/                # Architecture, Schema, API & Demo Guides
├── docker-compose.yml   # Multi-container orchestrator with healthchecks
├── .env.example         # Environment template
└── README.md
```

---

## ⚙️ Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `DATABASE_URL` | Async Database Connection URL | `postgresql+asyncpg://sentinel_user:sentinel_password_2026@postgres:5432/sentinel_db` |
| `REDIS_URL` | Redis Connection URL | `redis://redis:6379/0` |
| `SECRET_KEY` | JWT Signing Key | `sentinel_ai_super_secret_enterprise_key_2026_honeywell` |
| `POSTGRES_DB` | Postgres Database Name | `sentinel_db` |
| `POSTGRES_USER` | Postgres Database Username | `sentinel_user` |
| `POSTGRES_PASSWORD` | Postgres Database Password | `sentinel_password_2026` |

---

## 🚀 Quick Start & Running Locally

### 1. Docker Deployment (Recommended)
```bash
cp .env.example .env
docker compose up --build -d
```
Access the frontend at `http://localhost:3000` and API docs at `http://localhost:8000/docs`.

### 2. Manual Startup

**Backend**:
```bash
cd backend
pip install -r requirements.txt
python main.py
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev
```

### 3. Demo Credentials
- **Email**: `admin@honeywell.com`
- **Password**: `SentinelPass2026!`

---

## 🧪 Testing

Run backend tests:
```bash
pytest backend/tests/test_sentinel.py -v
```

---

## 🗺️ Future Roadmap

- [ ] Support for deep learning LSTM sequence anomaly models.
- [ ] Automated Slack & Microsoft Teams Webhook alert notifications.
- [ ] SOAR playbook integration for automated session termination.

---

## 📄 License & Governance
Honeywell Hackathon Project 2026. Production MVP Edition.
