import React from 'react';

interface RiskBadgeProps {
  score?: number;
  level?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ score, level, size = 'md' }) => {
  const displayLevel = level || (score !== undefined ? (score >= 85 ? 'Critical' : score >= 70 ? 'High' : score >= 35 ? 'Medium' : 'Low') : 'Low');

  const colorMap = {
    Low: 'bg-emerald-50 text-emerald-800 border-emerald-400',
    Medium: 'bg-amber-50 text-amber-900 border-amber-400',
    High: 'bg-orange-50 text-orange-900 border-orange-400',
    Critical: 'bg-red-600 text-white border-red-600 font-black',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] font-mono font-bold',
    md: 'px-2.5 py-1 text-xs font-mono font-bold',
    lg: 'px-3 py-1.5 text-xs font-mono font-black',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 uppercase border ${colorMap[displayLevel as keyof typeof colorMap] || colorMap.Low} ${sizeClasses[size]}`}>
      <span className={`h-1.5 w-1.5 ${displayLevel === 'Critical' ? 'animate-ping bg-white' : 'bg-current'}`} />
      <span>{score !== undefined ? `${score} • ` : ''}{displayLevel}</span>
    </span>
  );
};
