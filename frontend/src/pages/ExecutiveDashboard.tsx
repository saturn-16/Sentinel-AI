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
    <div className="space-y-6 text-slate-900 font-sans">
      <div className="border-b-2 border-black pb-4">
        <h1 className="text-2xl font-black text-black tracking-tight flex items-center gap-2 uppercase">
          <ShieldCheck className="w-6 h-6 text-red-600" />
          HONEYWELL EXECUTIVE SECURITY POSTURE & GOVERNANCE
        </h1>
        <p className="font-mono text-xs text-slate-600 mt-1 uppercase">High-level enterprise threat landscape summary for CISOs & executive leadership</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Organization Health Index" value={`${securityHealthScore}/100`} subtext="Overall Security Posture" change="Optimal" changeType="positive" icon={Award} iconColor="text-red-600" />
        <MetricCard title="Monitored Enterprise Workforce" value={analytics.total_users} subtext={`${analytics.active_sessions} Active Concurrent Users`} icon={Users} iconColor="text-red-600" />
        <MetricCard title="Active Critical Threat Cases" value={analytics.critical_alerts} subtext="Requires CISO Attention" change={analytics.critical_alerts > 0 ? 'Action Required' : 'Clean'} changeType={analytics.critical_alerts > 0 ? 'negative' : 'positive'} icon={AlertOctagon} iconColor="text-red-600" />
        <MetricCard title="Mean Organizational Risk" value={`${analytics.avg_risk_score}/100`} subtext="Workforce Behavioral Baseline" change="-1.2% vs last week" changeType="positive" icon={TrendingDown} iconColor="text-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border-2 border-black p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-black uppercase">Enterprise Behavioral Threat Trend (Monthly)</h2>
              <p className="font-mono text-xs text-slate-500 uppercase">Aggregated organizational risk index over time</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-mono font-bold bg-emerald-50 text-emerald-600 border border-emerald-300 uppercase">
              Low Threat Exposure
            </span>
          </div>
          <RiskTrendChart data={analytics.risk_trend} />
        </div>

        <div className="bg-white border-2 border-black p-6 shadow-sm space-y-4">
          <h2 className="text-base font-black text-black uppercase">Threat Severity Exposure</h2>
          <p className="font-mono text-xs text-slate-500 uppercase">Distribution of active alerts across severity tiers</p>
          <SeverityPieChart data={analytics.severity_distribution} />
        </div>
      </div>

      <div className="bg-white border-2 border-black p-6 shadow-sm space-y-4">
        <h2 className="text-base font-black text-black uppercase">Top Risky Identity Profiles</h2>
        <div className="overflow-x-auto font-mono text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-black text-slate-500 uppercase text-[10px]">
                <th className="py-3 px-4">EMPLOYEE NAME</th>
                <th className="py-3 px-4">DEPARTMENT</th>
                <th className="py-3 px-4">ROLE</th>
                <th className="py-3 px-4 text-right">RISK SCORE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {analytics.top_risky_users.map((user: any) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-black">{user.name}</td>
                  <td className="py-3 px-4 text-slate-600">{user.department}</td>
                  <td className="py-3 px-4 text-slate-600">{user.role}</td>
                  <td className="py-3 px-4 text-right font-bold text-red-600">{user.risk_score}/100</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
