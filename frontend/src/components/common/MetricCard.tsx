import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtext,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'text-red-600',
}) => {
  return (
    <div className="bg-white border-2 border-black p-5 shadow-sm hover:border-red-600 transition-colors">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest">{title}</span>
        <div className="p-2 bg-red-600/10 text-red-600 border border-red-500/20 rounded">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-3xl font-black text-black tracking-tight">{value}</span>
        {change && (
          <span
            className={`font-mono text-[11px] font-bold ${
              changeType === 'positive'
                ? 'text-emerald-600'
                : changeType === 'negative'
                ? 'text-red-600'
                : 'text-slate-500'
            }`}
          >
            {change}
          </span>
        )}
      </div>

      {subtext && <p className="mt-1 font-mono text-[11px] text-slate-500 uppercase">{subtext}</p>}
    </div>
  );
};
