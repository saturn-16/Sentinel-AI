export interface User {
  id: string;
  organization_id: string;
  email: string;
  full_name: string;
  role: 'Admin' | 'SOC Analyst' | 'Viewer';
  department: string;
  privilege_level: string;
  work_pattern: string;
  is_active: boolean;
  current_risk_score: number;
  created_at: string;
  updated_at: string;
}

export interface Device {
  id: string;
  user_id: string;
  device_name: string;
  device_type: string;
  os: string;
  browser: string;
  mac_address: string;
  is_trusted: boolean;
  trust_score: number;
  last_seen_at: string;
  created_at: string;
}

export interface AuthLog {
  id: string;
  user_id: string;
  device_id: string;
  timestamp: string;
  auth_method: string;
  status: 'SUCCESS' | 'FAILED';
  ip_address: string;
  country: string;
  city: string;
  user_agent: string;
  is_flagged: boolean;
  risk_score_value: number;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  device_id: string;
  timestamp: string;
  resource_accessed: string;
  action_type: string;
  command_executed?: string;
  session_id: string;
  duration_seconds: number;
  bytes_transferred: number;
}

export interface BehaviorProfile {
  id: string;
  user_id: string;
  normal_login_hours: { hours: number[] };
  normal_countries: { countries: string[] };
  normal_devices: { device_ids: string[] };
  normal_ip_ranges: { ips: string[] };
  auth_frequency_avg: number;
  session_duration_avg: number;
  common_resources: { resources: string[] };
  privilege_usage: { privilege: string };
  frequent_commands: { commands: string[] };
  behavior_consistency_score: number;
  updated_at: string;
}

export interface AttackEvent {
  id: string;
  alert_id: string;
  user_id: string;
  attack_type: string;
  confidence_score: number;
  details: Record<string, any>;
  created_at: string;
}

export interface Alert {
  id: string;
  user_id: string;
  event_type: string;
  risk_score_id?: string;
  title: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Dismissed';
  assigned_to?: string;
  explanation: {
    risk_score: number;
    attack_type: string;
    user_name: string;
    reasons: string[];
    suggested_actions: string[];
    summary_text: string;
    mitre_attack?: {
      tactic: string;
      technique: string;
      technique_id: string;
      description: string;
    };
  };
  created_at: string;
  updated_at: string;
  user?: User;
  attack_event?: AttackEvent;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'Investigating' | 'Contained' | 'Resolved' | 'Closed';
  assigned_to?: string;
  lead_analyst_id?: string;
  resolution_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsOverview {
  total_users: number;
  active_sessions: number;
  today_alerts: number;
  critical_alerts: number;
  avg_risk_score: number;
  detection_accuracy: number;
  threat_level: string;
  detection_latency_ms: number;
  false_positive_rate: number;
  precision: number;
  recall: number;
  f1_score: number;
  risk_distribution: Record<string, number>;
  severity_distribution: Record<string, number>;
  attack_distribution: Record<string, number>;
  top_risky_users: Array<{
    id: string;
    name: string;
    email: string;
    department: string;
    risk_score: number;
    role: string;
  }>;
  top_risky_devices: Array<{
    id: string;
    name: string;
    os: string;
    trust_score: number;
    is_trusted: boolean;
  }>;
  risk_trend: Array<{ time: string; avg_score: number; alerts: number }>;
  hourly_heatmap: Array<{ hour: string; normal: number; anomalous: number }>;
}

export interface LiveStreamEvent {
  type: string;
  timestamp: string;
  user_id: string;
  user_name: string;
  user_email: string;
  device_id: string;
  device_name: string;
  country: string;
  city: string;
  ip_address: string;
  status: string;
  risk_score: number;
  risk_level: string;
  attack_type: string;
  is_anomaly: boolean;
  alert_id?: string;
  explanation: Record<string, any>;
}

export interface PaginatedResponse<T> {
  total: number;
  page: number;
  size: number;
  pages: number;
  items: T[];
}
