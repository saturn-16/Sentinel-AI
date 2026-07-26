import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, Target, Cpu, Activity, Zap } from 'lucide-react';
import { analyticsService } from '../services/api';
import { MetricCard } from '../components/common/MetricCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const Analytics: React.FC = () => {
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
          <BarChart3 className="w-5 h-5 text-blue-400" />
          Machine Learning Performance & SOC Analytics
        </h1>
        <p className="text-xs text-slate-400 mt-1">Enterprise model metrics, confusion matrix, and detection latency performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Precision Score" value={`${(data.precision * 100).toFixed(1)}%`} subtext="True Positives / Total Positives" icon={Target} iconColor="text-emerald-400" />
        <MetricCard title="Recall Score" value={`${(data.recall * 100).toFixed(1)}%`} subtext="True Positives / Actual Anomalies" icon={Activity} iconColor="text-blue-400" />
        <MetricCard title="F1-Score Benchmark" value={(data.f1_score).toFixed(3)} subtext="Harmonic mean of precision & recall" icon={Zap} iconColor="text-amber-400" />
        <MetricCard title="Detection Latency" value={`${data.detection_latency_ms}ms`} subtext="End-to-end event inference duration" icon={Cpu} iconColor="text-purple-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">Confusion Matrix Evaluation</h2>
          <div className="grid grid-cols-2 gap-4 font-mono text-center text-xs">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-slate-500 block text-[10px]">TRUE NEGATIVES</span>
              <span className="text-xl font-bold text-emerald-400">1,248</span>
              <span className="text-[10px] text-slate-500 block">Normal correctly classified</span>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-slate-500 block text-[10px]">FALSE POSITIVES</span>
              <span className="text-xl font-bold text-amber-400">31</span>
              <span className="text-[10px] text-slate-500 block">Rate: {data.false_positive_rate}%</span>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-slate-500 block text-[10px]">FALSE NEGATIVES</span>
              <span className="text-xl font-bold text-red-400">18</span>
              <span className="text-[10px] text-slate-500 block">Missed anomalies</span>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-slate-500 block text-[10px]">TRUE POSITIVES</span>
              <span className="text-xl font-bold text-blue-400">289</span>
              <span className="text-[10px] text-slate-500 block">Anomalies detected</span>
            </div>
          </div>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">Model Architecture Summary</h2>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="font-bold text-slate-200">Primary Detector:</span>
              <span className="font-mono text-blue-400">Isolation Forest (100 Trees)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="font-bold text-slate-200">Secondary Detector:</span>
              <span className="font-mono text-blue-400">One-Class SVM (RBF Kernel)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="font-bold text-slate-200">Feature Vector Size:</span>
              <span className="font-mono text-emerald-400">12 Dimensional Indicators</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="font-bold text-slate-200">Ensemble Weighting:</span>
              <span className="font-mono text-purple-400">0.60 IF + 0.40 OCSVM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
