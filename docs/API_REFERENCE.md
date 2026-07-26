# SentinelAI REST API Reference

Base Endpoint: `/api/v1`

## 1. Authentication
- `POST /api/v1/auth/login`: Authenticate user and receive JWT access token.
- `GET /api/v1/auth/me`: Get current authenticated user details.

## 2. Users & Devices
- `GET /api/v1/users`: List users with pagination and search.
- `GET /api/v1/users/{id}`: Get user detail profile.
- `GET /api/v1/devices`: List monitored endpoints.
- `PATCH /api/v1/devices/{id}/trust`: Update device trust status.

## 3. Alerts & Incidents
- `GET /api/v1/alerts`: Query alerts by severity, status, and user.
- `GET /api/v1/alerts/{id}`: Get alert details with MITRE ATT&CK mapping.
- `PATCH /api/v1/alerts/{id}/status`: Update alert status (Open, Resolved, Dismissed).
- `GET /api/v1/incidents`: List SOC incident cases.
- `POST /api/v1/incidents`: Create new incident case file.

## 4. Synthetic Generator & Simulator
- `POST /api/v1/generator/generate-dataset`: Generate baseline enterprise dataset.
- `POST /api/v1/generator/simulate-attack`: Inject attack scenario (`Brute Force`, `Impossible Travel`, `Privilege Escalation`, etc.).

## 5. WebSockets
- `WS /api/v1/ws`: Persistent WebSocket stream pushing real-time authentication events and alerts.
