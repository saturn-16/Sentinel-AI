import React, { useState } from 'react';
import { Radio, Pause, Play, Search, Filter, ShieldAlert, CheckCircle, AlertOctagon } from 'lucide-react';
import { useSOCStore } from '../store/useSOCStore';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { Drawer } from '../components/common/Drawer';
import { LiveStreamEvent } from '../types';

export const LiveMonitoring: React.FC = () => {
  const { liveEvents, isStreamPaused, toggleStreamPause } = useSOCStore();
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [selectedEvent, setSelectedEvent] = useState<LiveStreamEvent | null>(null);

  const filteredEvents = liveEvents.filter((evt) => {
    const matchesSearch =
      evt.user_name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      evt.ip_address.includes(filterQuery) ||
      evt.country.toLowerCase().includes(filterQuery.toLowerCase()) ||
      evt.attack_type.toLowerCase().includes(filterQuery.toLowerCase());

    const matchesRisk = selectedRisk === 'ALL' || evt.risk_level === selectedRisk;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            Live Ingestion Stream
          </h1>
          <p className="text-xs text-slate-400 mt-1">Real-time authentication log processing with instant ML anomaly evaluation</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleStreamPause}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
              isStreamPaused
                ? 'bg-amber-950/50 text-amber-400 border-amber-800'
                : 'bg-emerald-950/50 text-emerald-400 border-emerald-800'
            }`}
          >
            {isStreamPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            <span>{isStreamPaused ? 'RESUME STREAM' : 'PAUSE STREAM'}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#111827] p-4 rounded-xl border border-slate-800">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by user, IP address, country, or attack vector..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full bg-[#1A2234] border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          {['ALL', 'Low', 'Medium', 'High', 'Critical'].map((level) => (
            <button
              key={level}
              onClick={() => setSelectedRisk(level)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${
                selectedRisk === level
                  ? 'bg-blue-600/20 text-blue-400 border-blue-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#1A2234] text-slate-400 font-semibold uppercase border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Source Location</th>
              <th className="px-4 py-3">IP Address</th>
              <th className="px-4 py-3">Auth Status</th>
              <th className="px-4 py-3">Risk Level</th>
              <th className="px-4 py-3">ML Attack Classification</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                  {liveEvents.length === 0
                    ? 'Connecting to live WebSocket event bus...'
                    : 'No events match the selected filters.'}
                </td>
              </tr>
            ) : (
              filteredEvents.map((evt, idx) => (
                <tr
                  key={idx}
                  onClick={() => setSelectedEvent(evt)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-slate-400">
                    {new Date(evt.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-100">{evt.user_name}</td>
                  <td className="px-4 py-3">{evt.city}, {evt.country}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{evt.ip_address}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={evt.status} />
                  </td>
                  <td className="px-4 py-3">
                    <RiskBadge score={evt.risk_score} level={evt.risk_level} size="sm" />
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-200">{evt.attack_type}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="px-2.5 py-1 rounded bg-slate-800 text-blue-400 hover:bg-slate-700 font-semibold text-[11px]">
                      Investigate
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedEvent && (
        <Drawer
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={`Real-Time Investigation: ${selectedEvent.user_name}`}
        >
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold">Calculated Risk Score</span>
                <div className="text-3xl font-extrabold text-slate-100 mt-1">{selectedEvent.risk_score} / 100</div>
              </div>
              <RiskBadge score={selectedEvent.risk_score} level={selectedEvent.risk_level} size="lg" />
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Explainability Engine Breakdown</h3>
              <div className="p-4 rounded-xl bg-[#141C2D] border border-blue-500/30 space-y-3 text-xs">
                <div className="font-bold text-slate-100 text-sm">{selectedEvent.explanation?.summary_text}</div>
                <div className="space-y-1.5">
                  {selectedEvent.explanation?.reasons?.map((reason: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-300">
                      <AlertOctagon className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Recommended SOC Response Protocol</h3>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                {selectedEvent.explanation?.suggested_actions?.map((act: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-emerald-400 font-medium">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">DEVICE NAME</span>
                <span className="text-slate-200 font-semibold">{selectedEvent.device_name}</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">SOURCE IP</span>
                <span className="text-slate-200 font-semibold">{selectedEvent.ip_address}</span>
              </div>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};
