import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Users, Activity, AlertTriangle, ShieldAlert, Zap, Target, Flame, Clock, Radio, Play
} from 'lucide-react';
import { analyticsService, generatorService } from '../services/api';
import { MetricCard } from '../components/common/MetricCard';
import { RiskTrendChart } from '../components/charts/RiskTrendChart';
import { AttackTimelineChart } from '../components/charts/AttackTimelineChart';
import { SeverityPieChart } from '../components/charts/SeverityPieChart';
import { RiskBadge } from '../components/common/RiskBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { useSOCStore } from '../store/useSOCStore';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { liveEvents } = useSOCStore();
  const [simulating, setSimulating] = useState(false);

  const { data: analytics, isLoading, refetch } = useQuery({
    queryKey: ['soc-analytics'],
    queryFn: analyticsService.getOverview,
    refetchInterval: 5000,
  });

  const handleSimulate = async (attackType: string) => {
    setSimulating(true);
    try {
      await generatorService.simulateAttack(attackType);
      await refetch();
    } finally {
      setSimulating(false);
    }
  };

  if (isLoading || !analytics) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            Enterprise Security Operations Center
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-400 border border-blue-500/30">
              HONEYWELL SOC
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Real-time behavioral anomaly detection & ML threat intelligence</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Inject Scenario:</span>
          {['Brute Force', 'Impossible Travel', 'Privilege Escalation'].map((type) => (
            <button
              key={type}
              disabled={simulating}
              onClick={() => handleSimulate(type)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{type}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Monitored Users" value={analytics.total_users} subtext={`${analytics.active_sessions} Active Sessions`} icon={Users} iconColor="text-blue-400" />
        <MetricCard title="Today's Alerts" value={analytics.today_alerts} subtext={`${analytics.critical_alerts} Critical Severity`} change="+3 vs yesterday" changeType="negative" icon={AlertTriangle} iconColor="text-amber-400" />
        <MetricCard title="Average Risk Score" value={`${analytics.avg_risk_score}/100`} subtext="Normalized Behavior Score" icon={Flame} iconColor="text-red-400" />
        <MetricCard title="Detection Accuracy" value={`${analytics.detection_accuracy}%`} subtext={`${analytics.detection_latency_ms}ms Avg Latency`} change="F1: 0.947" changeType="positive" icon={Target} iconColor="text-emerald-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-100">Behavioral Risk Trend (24h)</h2>
              <p className="text-xs text-slate-400">Mean anomaly score calculated across active user profiles</p>
            </div>
            <span className="text-xs font-mono text-blue-400 bg-blue-950/40 px-2 py-1 rounded border border-blue-800/40">Ensemble ML</span>
          </div>
          <RiskTrendChart data={analytics.risk_trend} />
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-100">Alert Severity Breakdown</h2>
            <span className="text-xs text-slate-400">Live SOC Data</span>
          </div>
          <SeverityPieChart data={analytics.severity_distribution} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-100">Detected Attack Vectors</h2>
            <span className="text-xs text-slate-400">ML Classifications</span>
          </div>
          <AttackTimelineChart data={analytics.attack_distribution} />
        </div>

        <div className="lg:col-span-2 bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <h2 className="text-sm font-bold text-slate-100">Real-Time Ingestion Stream Ticker</h2>
            </div>
            <button onClick={() => navigate('/live')} className="text-xs font-semibold text-blue-400 hover:text-blue-300">
              View Full Live Feed &rarr;
            </button>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto">
            {liveEvents.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                Waiting for authentication events... Stream active over WebSockets.
              </div>
            ) : (
              liveEvents.slice(0, 5).map((evt, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <RiskBadge score={evt.risk_score} level={evt.risk_level} size="sm" />
                    <div>
                      <span className="text-xs font-bold text-slate-200">{evt.user_name}</span>
                      <span className="text-xs text-slate-400 ml-2">({evt.attack_type})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
                    <span>{evt.country} ({evt.ip_address})</span>
                    <span>{new Date(evt.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-100">Most Risky Enterprise Users</h2>
            <button onClick={() => navigate('/users')} className="text-xs font-semibold text-blue-400 hover:text-blue-300">
              View All Users &rarr;
            </button>
          </div>
          <div className="space-y-2">
            {analytics.top_risky_users.map((u) => (
              <div key={u.id} onClick={() => navigate(`/users/${u.id}`)} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
                <div>
                  <div className="font-bold text-xs text-slate-200">{u.name}</div>
                  <div className="text-[11px] text-slate-500">{u.email} • {u.department}</div>
                </div>
                <RiskBadge score={u.risk_score} size="sm" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-100">Top Risky Endpoints & Devices</h2>
            <button onClick={() => navigate('/devices')} className="text-xs font-semibold text-blue-400 hover:text-blue-300">
              View Inventory &rarr;
            </button>
          </div>
          <div className="space-y-2">
            {analytics.top_risky_devices.map((d) => (
              <div key={d.id} onClick={() => navigate(`/devices/${d.id}`)} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
                <div>
                  <div className="font-bold text-xs text-slate-200">{d.name}</div>
                  <div className="text-[11px] text-slate-500">{d.os}</div>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${d.trust_score > 80 ? 'bg-emerald-950/50 text-emerald-400 border-emerald-800' : 'bg-red-950/50 text-red-400 border-red-800'}`}>
                  Trust: {d.trust_score}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
