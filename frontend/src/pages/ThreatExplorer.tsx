import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, ShieldAlert, ArrowUpDown, ExternalLink } from 'lucide-react';
import { logService } from '../services/api';
import { AuthLog } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { Drawer } from '../components/common/Drawer';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const ThreatExplorer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuthLog | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['threat-logs', countryFilter, statusFilter],
    queryFn: () => logService.getAuthLogs({ country: countryFilter || undefined, status: statusFilter || undefined, size: 50 }),
  });

  if (isLoading || !data) {
    return <LoadingSkeleton />;
  }

  const logs = data.items.filter((l) =>
    l.user_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.ip_address.includes(searchQuery) ||
    l.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      <div className="border-b-2 border-black pb-4">
        <h1 className="text-2xl font-black text-black tracking-tight flex items-center gap-2 uppercase">
          <Search className="w-5 h-5 text-red-600" />
          THREAT EXPLORER & DEEP SEARCH
        </h1>
        <p className="font-mono text-xs text-slate-600 mt-1 uppercase">Multi-vector security log analysis and behavioral correlation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 border-2 border-black font-mono text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by User ID, IP, City..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 pl-9 pr-4 py-2 text-xs font-mono text-black placeholder-slate-500 focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs font-mono font-bold text-black uppercase focus:outline-none"
          >
            <option value="">All Countries</option>
            <option value="United States">United States</option>
            <option value="Germany">Germany</option>
            <option value="India">India</option>
            <option value="Russia">Russia</option>
            <option value="Netherlands">Netherlands</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs font-mono font-bold text-black uppercase focus:outline-none"
          >
            <option value="">All Authentication Statuses</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>
      </div>

      <div className="bg-white border-2 border-black overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-100 text-black font-bold uppercase border-b-2 border-black">
            <tr>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">User ID</th>
              <th className="px-4 py-3">IP Address</th>
              <th className="px-4 py-3">Country / City</th>
              <th className="px-4 py-3">Auth Method</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Risk Value</th>
              <th className="px-4 py-3 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-medium">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500 uppercase">
                  No matching threat logs found in database.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-slate-600">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-bold text-black">{log.user_id.substring(0, 8)}...</td>
                  <td className="px-4 py-3 font-mono text-slate-700">{log.ip_address}</td>
                  <td className="px-4 py-3 text-slate-800">{log.city}, {log.country}</td>
                  <td className="px-4 py-3 text-slate-600">{log.auth_method}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={log.status} />
                  </td>
                  <td className="px-4 py-3">
                    <RiskBadge score={log.risk_score_value} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ExternalLink className="w-4 h-4 text-red-600 inline-block" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedLog && (
        <Drawer
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          title={`Log Inspection - ${selectedLog.id}`}
        >
          <div className="space-y-4 text-xs font-mono text-slate-900">
            <div className="p-4 bg-white border-2 border-black space-y-2">
              <div><span className="text-slate-500 font-bold">USER ID:</span> {selectedLog.user_id}</div>
              <div><span className="text-slate-500 font-bold">DEVICE ID:</span> {selectedLog.device_id}</div>
              <div><span className="text-slate-500 font-bold">IP ADDRESS:</span> {selectedLog.ip_address}</div>
              <div><span className="text-slate-500 font-bold">LOCATION:</span> {selectedLog.city}, {selectedLog.country}</div>
              <div><span className="text-slate-500 font-bold">USER AGENT:</span> {selectedLog.user_agent}</div>
              <div><span className="text-slate-500 font-bold">IS FLAGGED:</span> {selectedLog.is_flagged ? 'TRUE' : 'FALSE'}</div>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};
