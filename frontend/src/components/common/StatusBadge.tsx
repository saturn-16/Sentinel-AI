import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyle = (s: string) => {
    switch (s.toUpperCase()) {
      case 'SUCCESS':
      case 'RESOLVED':
      case 'TRUSTED':
      case 'ACTIVE':
      case 'CLOSED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'OPEN':
      case 'INVESTIGATING':
      case 'IN PROGRESS':
      case 'ELEVATED':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'FAILED':
      case 'CRITICAL':
      case 'DISMISSED':
      case 'UNTRUSTED':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600/50';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyle(status)}`}>
      {status}
    </span>
  );
};
