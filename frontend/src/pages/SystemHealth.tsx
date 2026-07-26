import React from 'react';
import { Activity, Server, Database, Radio, Cpu, HardDrive } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

export const SystemHealth: React.FC = () => {
  const services = [
    { name: 'FastAPI Backend Core', status: 'HEALTHY', latency: '2.4ms', icon: Server },
    { name: 'SQLAlchemy Async DB Engine', status: 'CONNECTED', latency: '1.1ms', icon: Database },
    { name: 'Redis Cache & Event PubSub', status: 'ACTIVE', latency: '0.8ms', icon: Activity },
    { name: 'WebSocket Event Broadcaster', status: 'ACTIVE', connections: '1 Active Client', icon: Radio },
    { name: 'Scikit-Learn ML Inference Engine', status: 'ONLINE', latency: '14.5ms', icon: Cpu },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          SentinelAI System Infrastructure & Health Diagnostics
        </h1>
        <p className="text-xs text-slate-400 mt-1">Real-time status of backend services, micro-pipelines, and hardware utilization</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111827] p-5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">CPU Utilization</span>
          <div className="text-2xl font-bold text-slate-100">14.2%</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '14.2%' }} />
          </div>
        </div>

        <div className="bg-[#111827] p-5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Memory Allocation</span>
          <div className="text-2xl font-bold text-slate-100">38.5%</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2">
            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '38.5%' }} />
          </div>
        </div>

        <div className="bg-[#111827] p-5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Active Async Worker Threads</span>
          <div className="text-2xl font-bold text-purple-400">4 Workers</div>
          <span className="text-[11px] text-slate-500">Asyncio Event Loop Healthy</span>
        </div>
      </div>

      <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">Microservice Health Matrix</h2>
        <div className="space-y-3">
          {services.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 text-blue-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-100">{s.name}</div>
                    <div className="text-xs text-slate-500 font-mono">
                      {s.latency ? `Response Latency: ${s.latency}` : s.connections}
                    </div>
                  </div>
                </div>
                <StatusBadge status={s.status} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
