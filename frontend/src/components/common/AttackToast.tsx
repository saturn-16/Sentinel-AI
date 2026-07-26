import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowRight, X, Activity, AlertTriangle } from 'lucide-react';
import { useToastStore, ToastMessage } from '../../store/useToastStore';

const SingleToast: React.FC<{ toast: ToastMessage }> = ({ toast }) => {
  const navigate = useNavigate();
  const { removeToast } = useToastStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 9000);
    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  return (
    <div className="w-96 bg-white border-2 border-black p-4 shadow-[6px_6px_0px_#000000] space-y-3 font-sans transition-all animate-bounce-short">
      <div className="flex items-start justify-between gap-3 border-b-2 border-black pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-red-600 text-white">
            <ShieldAlert className="w-4 h-4 animate-pulse" />
          </div>
          <span className="font-mono font-bold text-xs uppercase tracking-tight text-red-600">
            {toast.title}
          </span>
        </div>
        <button
          onClick={() => removeToast(toast.id)}
          className="text-slate-400 hover:text-black font-mono font-bold text-xs"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-1">
        <p className="text-xs text-black font-medium leading-snug">
          {toast.message}
        </p>
        <p className="text-[11px] font-mono text-slate-500">
          Check live detection logs in <span className="font-bold text-black">Live Monitoring</span> or <span className="font-bold text-black">Threat Explorer</span>.
        </p>
      </div>

      <div className="flex items-center gap-2 pt-1 border-t border-black/10">
        <button
          onClick={() => {
            removeToast(toast.id);
            navigate(toast.actionUrl || '/live');
          }}
          className="flex-1 px-3 py-1.5 bg-black hover:bg-red-600 text-white font-mono font-bold text-[10px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
        >
          {toast.actionLabel || 'VIEW LIVE MONITORING'} <ArrowRight className="w-3 h-3" />
        </button>
        <button
          onClick={() => {
            removeToast(toast.id);
            navigate('/alerts');
          }}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-black border border-black font-mono font-bold text-[10px] uppercase tracking-wider transition-colors"
        >
          ALERTS
        </button>
      </div>
    </div>
  );
};

export const AttackToastContainer: React.FC = () => {
  const { toasts } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-auto">
      {toasts.map((toast) => (
        <SingleToast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};
