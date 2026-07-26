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
    <div className="space-y-6 text-slate-900 font-sans">
      <div className="border-b-2 border-black pb-4">
        <h1 className="text-2xl font-black text-black tracking-tight flex items-center gap-2 uppercase">
          <UserCheck className="w-5 h-5 text-red-600" />
          BEHAVIORAL BASELINES & PROFILE PROFILING
        </h1>
        <p className="font-mono text-xs text-slate-600 mt-1 uppercase">Machine Learning models continuously update baseline normal behavior metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <div className="bg-white border-2 border-black p-5 space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Average Session Duration</span>
          <div className="text-3xl font-black text-black">8.0 Hours</div>
          <span className="text-[11px] text-slate-500 uppercase">Standard business shift baseline</span>
        </div>
        <div className="bg-white border-2 border-black p-5 space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Daily Auth Frequency Avg</span>
          <div className="text-3xl font-black text-red-600">4.5 Logins/Day</div>
          <span className="text-[11px] text-slate-500 uppercase">SSO Token Re-authentications</span>
        </div>
        <div className="bg-white border-2 border-black p-5 space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Mean Profile Consistency</span>
          <div className="text-3xl font-black text-black">94.8%</div>
          <span className="text-[11px] text-slate-500 uppercase">Low variance across workforce</span>
        </div>
      </div>

      <div className="bg-white border-2 border-black p-5 shadow-sm space-y-4 font-mono">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-black uppercase">Workforce Login Hour Baseline (24-Hour Distribution)</h2>
            <p className="text-xs text-slate-500 uppercase">Normal vs anomalous authentication attempts by hour of day</p>
          </div>
        </div>
        <HourlyHeatmap data={data.hourly_heatmap} />
      </div>
    </div>
  );
};
