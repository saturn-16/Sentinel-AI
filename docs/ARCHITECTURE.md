# SentinelAI Architecture Specification

SentinelAI is an enterprise-grade AI Behavioral Anomaly Detection & Security Operations Center (SOC) platform designed for Honeywell Hackathon 2026.

## 🏛️ System Overview

```
[ Authentication & Activity Logs ]
               │
               ▼
   [ Feature Extraction Engine ]  (12-dimensional behavioral vector)
               │
               ▼
    [ Ensemble ML Pipeline ]     (Isolation Forest + One-Class SVM)
               │
               ▼
     [ Risk Scoring Engine ]     (Normalized 0-100 score + risk level)
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

## 🧠 Machine Learning Engine Architecture

SentinelAI uses an ensemble approach combining unsupervised anomaly detection models:

1. **Isolation Forest (Primary Detector)**:
   - Evaluates random feature splits across 100 trees.
   - Isolates anomalies early due to unusual feature combinations.
2. **One-Class SVM (Secondary Detector)**:
   - Maps baseline features into a high-dimensional kernel space using an RBF kernel (`nu=0.05`).
   - Fits a decision boundary enclosing normal behavioral data.
3. **Ensemble Scoring Function**:
   - `Ensemble Anomaly Probability = 0.60 * P(IsolationForest) + 0.40 * P(OneClassSVM)`

## 🛡️ MITRE ATT&CK Framework Integration

Every anomaly detected by SentinelAI is mapped to MITRE ATT&CK Tactics and Techniques:
- `Brute Force` -> `TA0006 Credential Access` / `T1110`
- `Credential Stuffing` -> `TA0006 Credential Access` / `T1110.004`
- `Impossible Travel` -> `TA0001 Initial Access` / `T1078`
- `Device Spoofing` -> `TA0005 Defense Evasion` / `T1036`
- `Privilege Escalation` -> `TA0004 Privilege Escalation` / `T1068`
- `Lateral Movement` -> `TA0008 Lateral Movement` / `T1021`
- `Insider Threat` -> `TA0010 Exfiltration` / `T1048`
- `Slow Data Exfiltration` -> `TA0010 Exfiltration` / `T1030`
