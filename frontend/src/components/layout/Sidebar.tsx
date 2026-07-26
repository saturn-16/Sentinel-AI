import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ShieldAlert, LayoutDashboard, Radio, Search, AlertTriangle, FileText,
  Users, HardDrive, UserCheck, BarChart3, Activity, Settings, ChevronLeft, ChevronRight, Award, Globe
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const navItems = [
    { label: 'Landing Overview', path: '/landing', icon: Globe },
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Executive Dashboard', path: '/executive', icon: Award },
    { label: 'Live Monitoring', path: '/live', icon: Radio },
    { label: 'Threat Explorer', path: '/explorer', icon: Search },
    { label: 'Alerts', path: '/alerts', icon: AlertTriangle },
    { label: 'Incidents', path: '/incidents', icon: FileText },
    { label: 'Users', path: '/users', icon: Users },
    { label: 'Devices', path: '/devices', icon: HardDrive },
    { label: 'Behavior Profiles', path: '/profiles', icon: UserCheck },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Reports', path: '/reports', icon: FileText },
    { label: 'System Health', path: '/health', icon: Activity },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-[#0F1623] border-r border-slate-800 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-[#141C2D]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30 flex-shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-slate-100 tracking-tight text-base leading-none">SentinelAI</span>
              <span className="text-[10px] text-blue-400 font-mono mt-0.5">HONEYWELL SOC</span>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className="text-slate-400 hover:text-slate-100 p-1 rounded-md hover:bg-slate-800 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-800 bg-[#141C2D]/50 text-xs text-slate-400">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px]">v1.0.0 (Enterprise)</span>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
          </div>
        )}
      </div>
    </aside>
  );
};
