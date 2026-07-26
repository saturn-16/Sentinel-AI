# SentinelAI Database Schema Reference

SentinelAI uses normalized relational schemas managed via SQLAlchemy 2.0 Async (PostgreSQL in production, SQLite fallback).

## Entity Relationship Summary

- `organizations`: Root enterprise entity (`id`, `name`, `domain`, `industry`, `created_at`, `updated_at`).
- `users`: Monitored employee records (`id`, `organization_id`, `email`, `hashed_password`, `full_name`, `role`, `department`, `privilege_level`, `work_pattern`, `is_active`, `current_risk_score`).
- `devices`: Endpoint hardware inventory (`id`, `user_id`, `device_name`, `device_type`, `os`, `browser`, `mac_address`, `is_trusted`, `trust_score`, `last_seen_at`).
- `authentication_logs`: Auth events (`id`, `user_id`, `device_id`, `timestamp`, `auth_method`, `status`, `ip_address`, `country`, `city`, `user_agent`, `is_flagged`, `risk_score_value`).
- `activity_logs`: Resource access logs (`id`, `user_id`, `device_id`, `timestamp`, `resource_accessed`, `action_type`, `command_executed`, `session_id`, `duration_seconds`, `bytes_transferred`).
- `behavior_profiles`: ML baseline profiles (`id`, `user_id`, `normal_login_hours`, `normal_countries`, `normal_devices`, `normal_ip_ranges`, `auth_frequency_avg`, `session_duration_avg`, `common_resources`, `privilege_usage`, `frequent_commands`, `behavior_consistency_score`).
- `risk_scores`: Calculated risk entries (`id`, `user_id`, `timestamp`, `score`, `level`, `ml_confidence`, `behavior_deviation`, `attack_indicators`, `explainability_notes`).
- `alerts`: SOC alert records (`id`, `user_id`, `event_type`, `risk_score_id`, `title`, `severity`, `status`, `assigned_to`, `explanation`).
- `attack_events`: Detailed attack vector entries (`id`, `alert_id`, `user_id`, `attack_type`, `confidence_score`, `details`).
- `incidents`: SOC case management (`id`, `title`, `description`, `severity`, `status`, `assigned_to`, `lead_analyst_id`, `resolution_notes`).
- `predictions`: ML inference log history (`id`, `user_id`, `model_name`, `anomaly_score`, `confidence_score`, `prediction_probability`, `is_anomaly`, `feature_vector`).
