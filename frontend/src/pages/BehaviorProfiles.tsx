import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserCheck, Clock, Globe, Terminal, Shield } from 'lucide-react';
import { analyticsService } from '../services/api';
import { HourlyHeatmap } from '../components/charts/HourlyHeatmap';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const BehaviorProfiles: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['soc-analytics'],
    queryFn: analyticsService.getOverview,
  });

  if (isLoading || !data) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-blue-400" />
          Behavioral Baselines & Profile Profiling
        </h1>
        <p className="text-xs text-slate-400 mt-1">Machine Learning models continuously update baseline normal behavior metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111827] p-5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Average Session Duration</span>
          <div className="text-2xl font-bold text-slate-100">8.0 Hours</div>
          <span className="text-[11px] text-slate-500">Standard business shift baseline</span>
        </div>
        <div className="bg-[#111827] p-5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Daily Auth Frequency Avg</span>
          <div className="text-2xl font-bold text-blue-400">4.5 Logins/Day</div>
          <span className="text-[11px] text-slate-500">SSO Token Re-authentications</span>
        </div>
        <div className="bg-[#111827] p-5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Mean Profile Consistency</span>
          <div className="text-2xl font-bold text-emerald-400">94.8%</div>
          <span className="text-[11px] text-slate-500">Low variance across workforce</span>
        </div>
      </div>

      <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-100">Workforce Login Hour Baseline (24-Hour Distribution)</h2>
            <p className="text-xs text-slate-400">Normal vs anomalous authentication attempts by hour of day</p>
          </div>
        </div>
        <HourlyHeatmap data={data.hourly_heatmap} />
      </div>
    </div>
  );
};
