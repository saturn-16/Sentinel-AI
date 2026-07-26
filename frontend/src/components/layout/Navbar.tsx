import React from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, Pause, Play, Shield, LogOut, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useSOCStore } from '../../store/useSOCStore';

interface NavbarProps {
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNotifications }) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { isStreamPaused, toggleStreamPause, unreadCount, setCommandPaletteOpen } = useSOCStore();

  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    return path.substring(1).split('/')[0].replace('-', ' ').toUpperCase();
  };

  return (
    <header className="h-16 bg-[#111827] border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <span>SOC Platform</span>
          <span>/</span>
          <span className="text-slate-100 font-bold tracking-wide">{getBreadcrumbs()}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleStreamPause}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            isStreamPaused
              ? 'bg-amber-950/40 text-amber-400 border-amber-800/50'
              : 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50'
          }`}
        >
          {isStreamPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          <span>{isStreamPaused ? 'STREAM PAUSED' : 'LIVE STREAM'}</span>
        </button>

        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Global Search...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-900 text-[10px] font-mono border border-slate-700">Ctrl+K</kbd>
        </button>

        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-600 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        <div className="h-6 w-px bg-slate-800" />

        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold text-slate-100">{user?.full_name || 'SOC Analyst'}</span>
            <span className="text-[10px] text-blue-400 font-mono">{user?.role || 'SOC Tier 2'}</span>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
