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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-xs font-sans">
      <div className="w-full max-w-xl bg-white border-2 border-black shadow-2xl overflow-hidden">
        <div className="p-4 border-b-2 border-black flex items-center gap-3 bg-slate-100">
          <Search className="w-5 h-5 text-black" />
          <input
            type="text"
            autoFocus
            placeholder="Search users, IPs, devices, alerts, or attack vectors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-black placeholder-slate-500 focus:outline-none text-sm font-mono font-bold"
          />
          <button onClick={() => setCommandPaletteOpen(false)} className="p-1 border border-black bg-white text-black hover:bg-black hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 font-mono text-xs divide-y divide-slate-200">
          {filtered.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={() => {
                  navigate(item.path);
                  setCommandPaletteOpen(false);
                }}
                className="flex items-center justify-between p-3 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-red-600" />
                  <span className="font-bold text-black uppercase">{item.label}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase bg-slate-200 px-2 py-0.5 border border-slate-300">{item.category}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
