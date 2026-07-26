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
      case 'HEALTHY':
      case 'CONNECTED':
      case 'ONLINE':
        return 'bg-emerald-50 text-emerald-800 border-emerald-400';
      case 'OPEN':
      case 'INVESTIGATING':
      case 'IN PROGRESS':
      case 'ELEVATED':
        return 'bg-slate-100 text-slate-900 border-black';
      case 'FAILED':
      case 'CRITICAL':
      case 'DISMISSED':
      case 'UNTRUSTED':
        return 'bg-red-50 text-red-700 border-red-400';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold uppercase border ${getStyle(status)}`}>
      {status}
    </span>
  );
};
