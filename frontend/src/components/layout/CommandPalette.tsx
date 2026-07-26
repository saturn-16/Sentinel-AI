import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, HardDrive, AlertTriangle, FileText, X } from 'lucide-react';
import { useSOCStore } from '../../store/useSOCStore';

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useSOCStore();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const quickLinks = [
    { label: 'View Live Auth Stream', path: '/live', icon: AlertTriangle, category: 'Real-Time' },
    { label: 'Investigate Brute Force Attacks', path: '/explorer?type=Brute+Force', icon: Search, category: 'Threats' },
    { label: 'View High Risk Users', path: '/users', icon: User, category: 'Entities' },
    { label: 'Review Untrusted Devices', path: '/devices', icon: HardDrive, category: 'Inventory' },
    { label: 'SOC Incident Case File #104', path: '/incidents', icon: FileText, category: 'Incidents' },
  ];

  const filtered = quickLinks.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-[#111827] border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            placeholder="Search users, IPs, devices, alerts, or attack vectors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-500 focus:outline-none text-sm font-medium"
          />
          <button onClick={() => setCommandPaletteOpen(false)} className="text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-800/40">
          {filtered.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={() => {
                  setCommandPaletteOpen(false);
                  navigate(item.path);
                }}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/60 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-semibold text-slate-200">{item.label}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {item.category}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
