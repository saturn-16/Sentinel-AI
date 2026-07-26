import React from 'react';

interface RiskBadgeProps {
  score?: number;
  level?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ score, level, size = 'md' }) => {
  const displayLevel = level || (score !== undefined ? (score >= 85 ? 'Critical' : score >= 70 ? 'High' : score >= 35 ? 'Medium' : 'Low') : 'Low');

  const colorMap = {
    Low: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50',
    Medium: 'bg-amber-950/60 text-amber-400 border-amber-800/50',
    High: 'bg-orange-950/60 text-orange-400 border-orange-800/50',
    Critical: 'bg-red-950/60 text-red-400 border-red-800/50 hover:bg-red-900/60',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-bold',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border ${colorMap[displayLevel as keyof typeof colorMap] || colorMap.Low} ${sizeClasses[size]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${displayLevel === 'Critical' ? 'animate-ping bg-red-400' : 'bg-current'}`} />
      <span>{score !== undefined ? `${score} • ` : ''}{displayLevel}</span>
    </span>
  );
};
