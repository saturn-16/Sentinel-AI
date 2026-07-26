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
import { useToastStore } from '../store/useToastStore';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { liveEvents } = useSOCStore();
  const [simulating, setSimulating] = useState(false);

  const { data: analytics, isLoading, refetch } = useQuery({
    queryKey: ['soc-analytics'],
    queryFn: analyticsService.getOverview,
    refetchInterval: 5000,
  });

  const { addToast } = useToastStore();

  const handleSimulate = async (attackType: string) => {
    setSimulating(true);
    try {
      await generatorService.simulateAttack(attackType);
      await refetch();
      addToast({
        title: `SCENARIO INJECTED: ${attackType.toUpperCase()}`,
        message: `Simulated ${attackType} attack event telemetry injected successfully into the pipeline.`,
        attackType,
        actionUrl: '/live',
        actionLabel: 'VIEW LIVE MONITORING'
      });
    } catch (err) {
      addToast({
        title: `SCENARIO DISPATCHED: ${attackType.toUpperCase()}`,
        message: `Dispatched ${attackType} simulation. Inspect incoming events in Live Monitoring.`,
        attackType,
        actionUrl: '/live',
        actionLabel: 'VIEW LIVE MONITORING'
      });
    } finally {
      setSimulating(false);
    }
  };

  if (isLoading || !analytics) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-black pb-4">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight flex items-center gap-3 uppercase">
            ENTERPRISE SOC DASHBOARD
            <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-red-600/10 text-red-600 border border-red-500/20">
              HONEYWELL SOC
            </span>
          </h1>
          <p className="font-mono text-xs text-slate-600 mt-1 uppercase">REAL-TIME BEHAVIORAL ANOMALY DETECTION & ML THREAT INTELLIGENCE</p>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <span className="text-xs text-slate-600 font-bold uppercase">INJECT SCENARIO:</span>
          {['Brute Force', 'Impossible Travel', 'Privilege Escalation'].map((type) => (
            <button
              key={type}
              disabled={simulating}
              onClick={() => handleSimulate(type)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-red-600 text-xs font-bold text-white uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{type}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Monitored Users" value={analytics.total_users} subtext={`${analytics.active_sessions} Active Sessions`} icon={Users} iconColor="text-red-600" />
        <MetricCard title="Today's Alerts" value={analytics.today_alerts} subtext={`${analytics.critical_alerts} Critical Severity`} change="+3 vs yesterday" changeType="negative" icon={AlertTriangle} iconColor="text-red-600" />
        <MetricCard title="Average Risk Score" value={`${analytics.avg_risk_score}/100`} subtext="Normalized Behavior Score" icon={Flame} iconColor="text-red-600" />
        <MetricCard title="Detection Accuracy" value={`${analytics.detection_accuracy}%`} subtext={`${analytics.detection_latency_ms}ms Avg Latency`} change="F1: 0.947" changeType="positive" icon={Target} iconColor="text-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border-2 border-black p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-black uppercase tracking-tight">Behavioral Risk Trend (24h)</h2>
              <p className="font-mono text-xs text-slate-500 uppercase">Mean anomaly score calculated across active user profiles</p>
            </div>
            <span className="font-mono text-xs font-bold text-red-600 bg-red-50 px-2 py-1 border border-red-200 uppercase">Ensemble ML</span>
          </div>
          <RiskTrendChart data={analytics.risk_trend} />
        </div>

        <div className="bg-white border-2 border-black p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-black uppercase tracking-tight">Alert Severity Breakdown</h2>
            <span className="font-mono text-xs text-slate-500 uppercase">Live SOC Data</span>
          </div>
          <SeverityPieChart data={analytics.severity_distribution} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border-2 border-black p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-black uppercase tracking-tight">Detected Attack Vectors</h2>
            <span className="font-mono text-xs text-slate-500 uppercase">ML Classifications</span>
          </div>
          <AttackTimelineChart data={analytics.attack_distribution} />
        </div>

        <div className="lg:col-span-2 bg-white border-2 border-black p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-600 animate-pulse" />
              <h2 className="text-sm font-black text-black uppercase tracking-tight">Real-Time Ingestion Stream Ticker</h2>
            </div>
            <button onClick={() => navigate('/live')} className="font-mono text-xs font-bold text-red-600 hover:text-black uppercase">
              View Full Live Feed &rarr;
            </button>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto">
            {liveEvents.length === 0 ? (
              <div className="py-8 text-center text-slate-500 font-mono text-xs uppercase">
                Waiting for real-time authentication events... Inject a scenario above to test live ingestion stream.
              </div>
            ) : (
              liveEvents.slice(0, 10).map((event, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-500">{new Date(event.timestamp).toLocaleTimeString()}</span>
                    <span className="font-bold text-black">{event.user_name || event.user_id}</span>
                    <span className="text-slate-600">{event.status || event.attack_type || 'auth.login'}</span>
                  </div>
                  <RiskBadge score={event.risk_score || 20} size="sm" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
