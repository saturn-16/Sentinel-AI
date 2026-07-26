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
    <div className="space-y-6 text-slate-900 font-sans">
      <div className="border-b-2 border-black pb-4">
        <h1 className="text-2xl font-black text-black tracking-tight flex items-center gap-2 uppercase">
          <BarChart3 className="w-5 h-5 text-red-600" />
          MACHINE LEARNING PERFORMANCE & SOC ANALYTICS
        </h1>
        <p className="font-mono text-xs text-slate-600 mt-1 uppercase">Enterprise model metrics, confusion matrix, and detection latency performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Precision Score" value={`${(data.precision * 100).toFixed(1)}%`} subtext="True Positives / Total Positives" icon={Target} iconColor="text-red-600" />
        <MetricCard title="Recall Score" value={`${(data.recall * 100).toFixed(1)}%`} subtext="True Positives / Actual Anomalies" icon={Activity} iconColor="text-red-600" />
        <MetricCard title="F1-Score Benchmark" value={(data.f1_score).toFixed(3)} subtext="Harmonic mean of precision & recall" icon={Zap} iconColor="text-red-600" />
        <MetricCard title="Detection Latency" value={`${data.detection_latency_ms}ms`} subtext="End-to-end event inference duration" icon={Cpu} iconColor="text-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-black p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-black uppercase border-b-2 border-black pb-3">Confusion Matrix Evaluation</h2>
          <div className="grid grid-cols-2 gap-4 font-mono text-center text-xs">
            <div className="p-4 bg-slate-50 border border-slate-300">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">TRUE NEGATIVES</span>
              <span className="text-2xl font-black text-black">1,248</span>
              <span className="text-[10px] text-slate-500 block uppercase">Normal correctly classified</span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-300">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">FALSE POSITIVES</span>
              <span className="text-2xl font-black text-red-600">31</span>
              <span className="text-[10px] text-slate-500 block uppercase">Rate: {data.false_positive_rate}%</span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-300">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">FALSE NEGATIVES</span>
              <span className="text-2xl font-black text-red-600">18</span>
              <span className="text-[10px] text-slate-500 block uppercase">Missed anomalies</span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-300">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">TRUE POSITIVES</span>
              <span className="text-2xl font-black text-black">289</span>
              <span className="text-[10px] text-slate-500 block uppercase">Anomalies detected</span>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-black p-6 shadow-sm space-y-4 font-mono">
          <h2 className="text-sm font-black text-black uppercase border-b-2 border-black pb-3">Model Architecture Specs</h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-slate-200">
              <span className="text-slate-600">ENSEMBLE ALGORITHMS</span>
              <span className="font-bold text-black">Isolation Forest & One-Class SVM</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-200">
              <span className="text-slate-600">FEATURE DIMENSIONS</span>
              <span className="font-bold text-black">24 Continuous Features</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-200">
              <span className="text-slate-600">EXPLAINABILITY PIPELINE</span>
              <span className="font-bold text-black">SHAP (SHapley Additive exPlanations)</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-200">
              <span className="text-slate-600">POLICY RULE WEIGHTING</span>
              <span className="font-bold text-black">PyYAML Configurable Engine</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
