import React from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, Pause, Play, ShieldAlert, LogOut, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useSOCStore } from '../../store/useSOCStore';

interface NavbarProps {
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNotifications }) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { isStreamPaused, toggleStreamPause, unreadCount, setCommandPaletteOpen } = useSOCStore();

  return (
    <header className="h-16 bg-[#FAFAFA]/90 backdrop-blur-md border-b border-black/10 px-6 flex items-center justify-between sticky top-0 z-30 font-sans">
      <div className="flex items-center gap-4 pl-12">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.location.href = '/landing'}>
          <div className="p-1.5 bg-red-600/10 text-red-600 rounded-md border border-red-500/20">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-black text-sm tracking-tighter leading-none uppercase">SENTINELAI</span>
            <span className="text-[9px] text-red-600 font-mono tracking-widest uppercase">HONEYWELL SOC</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleStreamPause}
          className={`flex items-center gap-2 px-3 py-1.5 font-mono text-[10px] uppercase font-bold border transition-all ${
            isStreamPaused
              ? 'bg-amber-100 text-amber-900 border-amber-300'
              : 'bg-red-50 text-red-600 border-red-200'
          }`}
        >
          {isStreamPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          <span>{isStreamPaused ? 'STREAM PAUSED' : 'LIVE STREAM'}</span>
        </button>

        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-black/20 text-xs font-mono text-slate-600 hover:text-black hover:border-black transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-mono border border-slate-300">Ctrl+K</kbd>
        </button>

        <button
          onClick={onOpenNotifications}
          className="relative p-2 bg-white border border-black/20 text-slate-700 hover:text-black hover:border-black transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-600 text-[10px] font-bold text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        <div className="h-6 w-px bg-black/10" />

        <div className="flex items-center gap-3 font-mono">
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold text-black uppercase">{user?.full_name || 'SOC ANALYST'}</span>
            <span className="text-[9px] text-red-600 font-bold uppercase tracking-widest">{user?.role || 'SOC TIER 2'}</span>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
