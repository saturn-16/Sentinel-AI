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
    <div className="space-y-6 text-slate-900 font-sans">
      <div className="border-b-2 border-black pb-4">
        <h1 className="text-2xl font-black text-black tracking-tight flex items-center gap-2 uppercase">
          <Activity className="w-5 h-5 text-red-600" />
          SENTINELAI SYSTEM INFRASTRUCTURE & HEALTH DIAGNOSTICS
        </h1>
        <p className="font-mono text-xs text-slate-600 mt-1 uppercase">Real-time status of backend services, micro-pipelines, and hardware utilization</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <div className="bg-white border-2 border-black p-5 space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase">CPU Utilization</span>
          <div className="text-3xl font-black text-black">14.2%</div>
          <div className="w-full bg-slate-100 h-2 border border-black mt-2">
            <div className="bg-black h-full" style={{ width: '14.2%' }} />
          </div>
        </div>

        <div className="bg-white border-2 border-black p-5 space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Memory Allocation</span>
          <div className="text-3xl font-black text-black">38.5%</div>
          <div className="w-full bg-slate-100 h-2 border border-black mt-2">
            <div className="bg-red-600 h-full" style={{ width: '38.5%' }} />
          </div>
        </div>

        <div className="bg-white border-2 border-black p-5 space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Active Async Worker Threads</span>
          <div className="text-3xl font-black text-red-600">4 Workers</div>
          <span className="text-[11px] text-slate-500 uppercase">Asyncio Event Loop Healthy</span>
        </div>
      </div>

      <div className="bg-white border-2 border-black p-6 shadow-sm space-y-4 font-mono">
        <h2 className="text-sm font-black text-black uppercase border-b-2 border-black pb-3">Microservice Health Matrix</h2>
        <div className="space-y-3">
          {services.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 border border-black bg-white text-black">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-black uppercase">{s.name}</div>
                    <div className="text-xs text-slate-500">{s.latency ? `Response Latency: ${s.latency}` : s.connections}</div>
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
