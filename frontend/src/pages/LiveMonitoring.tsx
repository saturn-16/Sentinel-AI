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
    <div className="space-y-6 text-slate-900 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-black pb-4">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight flex items-center gap-2 uppercase">
            <Radio className="w-5 h-5 text-red-600 animate-pulse" />
            LIVE INGESTION STREAM
          </h1>
          <p className="font-mono text-xs text-slate-600 mt-1 uppercase">Real-time authentication log processing with instant ML anomaly evaluation</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleStreamPause}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider border transition-all ${
              isStreamPaused
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-red-600 text-white border-red-600 hover:bg-black'
            }`}
          >
            {isStreamPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            <span>{isStreamPaused ? 'RESUME STREAM' : 'PAUSE STREAM'}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 border-2 border-black">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by user, IP address, country, or attack vector..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 pl-9 pr-4 py-2 text-xs font-mono text-black placeholder-slate-500 focus:outline-none focus:border-black"
          />
        </div>

        <div className="flex items-center gap-2 font-mono">
          <Filter className="w-4 h-4 text-slate-500" />
          {['ALL', 'Low', 'Medium', 'High', 'Critical'].map((level) => (
            <button
              key={level}
              onClick={() => setSelectedRisk(level)}
              className={`px-3 py-1.5 text-xs font-bold uppercase transition-all ${
                selectedRisk === level
                  ? 'bg-black text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border-2 border-black overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-100 text-black font-bold uppercase border-b-2 border-black">
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
          <tbody className="divide-y divide-slate-200 font-medium">
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                  {liveEvents.length === 0 ? (
                    <div className="space-y-2">
                      <div className="font-bold text-black uppercase">WebSocket Connected • Awaiting Traffic</div>
                      <div className="text-xs text-slate-500 uppercase">Click <span className="text-red-600 font-bold">"Inject Scenario"</span> on the Dashboard to simulate live authentication events.</div>
                    </div>
                  ) : (
                    'No events match the selected filters.'
                  )}
                </td>
              </tr>
            ) : (
              filteredEvents.map((evt, idx) => (
                <tr
                  key={idx}
                  onClick={() => setSelectedEvent(evt)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-slate-600">
                    {new Date(evt.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-3 font-bold text-black">{evt.user_name}</td>
                  <td className="px-4 py-3 text-slate-700">{evt.city}, {evt.country}</td>
                  <td className="px-4 py-3 font-mono text-slate-600">{evt.ip_address}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={evt.status} />
                  </td>
                  <td className="px-4 py-3">
                    <RiskBadge score={evt.risk_score} level={evt.risk_level} size="sm" />
                  </td>
                  <td className="px-4 py-3 font-bold text-black">{evt.attack_type}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="px-2.5 py-1 bg-black text-white hover:bg-red-600 font-bold text-[11px] uppercase">
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
          <div className="space-y-6 text-slate-900 font-sans">
            <div className="p-4 bg-white border-2 border-black flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-slate-500 uppercase font-bold">Calculated Risk Score</span>
                <div className="text-4xl font-black text-black mt-1">{selectedEvent.risk_score} / 100</div>
              </div>
              <RiskBadge score={selectedEvent.risk_score} level={selectedEvent.risk_level} size="lg" />
            </div>

            <div className="space-y-3 font-mono">
              <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Explainability Engine Breakdown</h3>
              <div className="p-4 bg-red-50 border-2 border-red-500/30 space-y-3 text-xs">
                <div className="font-bold text-black text-sm">{selectedEvent.explanation?.summary_text}</div>
                <div className="space-y-1.5">
                  {selectedEvent.explanation?.reasons?.map((reason: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-800">
                      <AlertOctagon className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 font-mono">
              <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Recommended SOC Response Protocol</h3>
              <div className="p-4 bg-white border-2 border-black space-y-2 text-xs">
                {selectedEvent.explanation?.suggested_actions?.map((act: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-emerald-700 font-bold">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};
