import React from 'react';
import { Drawer } from '../common/Drawer';
import { useSOCStore } from '../../store/useSOCStore';
import { RiskBadge } from '../common/RiskBadge';
import { Check, Trash2 } from 'lucide-react';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, dismissNotification } = useSOCStore();

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="SOC Real-Time Notifications">
      {notifications.length === 0 ? (
        <div className="py-12 text-center text-slate-500 text-sm">
          No critical alerts in notification center.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border transition-all ${
                n.read
                  ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                  : 'bg-[#141C2D] border-blue-500/30 text-slate-100 shadow-md'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RiskBadge level={n.severity} size="sm" />
                  <span className="font-bold text-xs">{n.title}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{n.timestamp}</span>
              </div>
              <p className="mt-2 text-xs text-slate-300">{n.message}</p>
              <div className="mt-3 flex items-center justify-end gap-2 border-t border-slate-800/60 pt-2">
                {!n.read && (
                  <button
                    onClick={() => markNotificationRead(n.id)}
                    className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    <Check className="w-3 h-3" /> Mark read
                  </button>
                )}
                <button
                  onClick={() => dismissNotification(n.id)}
                  className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-red-400"
                >
                  <Trash2 className="w-3 h-3" /> Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Drawer>
  );
};
