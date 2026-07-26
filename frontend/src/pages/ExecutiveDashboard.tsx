import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, AlertOctagon, TrendingDown, Building, Users, Award } from 'lucide-react';
import { analyticsService } from '../services/api';
import { MetricCard } from '../components/common/MetricCard';
import { RiskTrendChart } from '../components/charts/RiskTrendChart';
import { SeverityPieChart } from '../components/charts/SeverityPieChart';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const ExecutiveDashboard: React.FC = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['soc-analytics'],
    queryFn: analyticsService.getOverview,
    refetchInterval: 10000,
  });

  if (isLoading || !analytics) {
    return <LoadingSkeleton />;
  }

  const securityHealthScore = Math.max(70, Math.round(100 - analytics.avg_risk_score * 0.8));

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          Honeywell Executive Security Posture & Governance
        </h1>
        <p className="text-xs text-slate-400 mt-1">High-level enterprise threat landscape summary for CISOs & executive leadership</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Organization Health Index" value={`${securityHealthScore}/100`} subtext="Overall Security Posture" change="Optimal" changeType="positive" icon={Award} iconColor="text-emerald-400" />
        <MetricCard title="Monitored Enterprise Workforce" value={analytics.total_users} subtext={`${analytics.active_sessions} Active Concurrent Users`} icon={Users} iconColor="text-blue-400" />
        <MetricCard title="Active Critical Threat Cases" value={analytics.critical_alerts} subtext="Requires CISO Attention" change={analytics.critical_alerts > 0 ? 'Action Required' : 'Clean'} changeType={analytics.critical_alerts > 0 ? 'negative' : 'positive'} icon={AlertOctagon} iconColor="text-red-400" />
        <MetricCard title="Mean Organizational Risk" value={`${analytics.avg_risk_score}/100`} subtext="Workforce Behavioral Baseline" change="-1.2% vs last week" changeType="positive" icon={TrendingDown} iconColor="text-amber-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100">Enterprise Behavioral Threat Trend (Monthly)</h2>
              <p className="text-xs text-slate-400">Aggregated organizational risk index over time</p>
            </div>
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800">
              Low Threat Exposure
            </span>
          </div>
          <RiskTrendChart data={analytics.risk_trend} />
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-100">Threat Severity Exposure</h2>
          <p className="text-xs text-slate-400">Distribution of active alerts across severity tiers</p>
          <SeverityPieChart data={analytics.severity_distribution} />
        </div>
      </div>

      <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-100 border-b border-slate-800 pb-3">Departmental Risk Posture Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
          {[
            { dept: 'Security Operations', score: '96/100', status: 'Optimal', color: 'text-emerald-400' },
            { dept: 'Software Engineering', score: '91/100', status: 'Good', color: 'text-blue-400' },
            { dept: 'Finance & Supply Chain', score: '85/100', status: 'Moderate', color: 'text-amber-400' }
          ].map((d, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-slate-100 font-bold text-sm">{d.dept}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Status: {d.status}</div>
              </div>
              <span className={`text-base font-extrabold ${d.color}`}>{d.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
