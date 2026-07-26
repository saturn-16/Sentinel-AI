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
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-400" />
          Threat Explorer & Deep Search
        </h1>
        <p className="text-xs text-slate-400 mt-1">Multi-vector security log analysis and behavioral correlation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#111827] p-4 rounded-xl border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by User ID, IP, City..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A2234] border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="w-full bg-[#1A2234] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
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
            className="w-full bg-[#1A2234] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Authentication Statuses</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>
      </div>

      <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#1A2234] text-slate-400 font-semibold uppercase border-b border-slate-800">
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
          <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                  No matching threat logs found in database.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-slate-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-200">{log.user_id.substring(0, 8)}...</td>
                  <td className="px-4 py-3 font-mono">{log.ip_address}</td>
                  <td className="px-4 py-3">{log.city}, {log.country}</td>
                  <td className="px-4 py-3 text-slate-400">{log.auth_method}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={log.status} />
                  </td>
                  <td className="px-4 py-3">
                    <RiskBadge score={log.risk_score_value} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ExternalLink className="w-4 h-4 text-blue-400 inline-block" />
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
          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
              <div><span className="text-slate-500">USER ID:</span> {selectedLog.user_id}</div>
              <div><span className="text-slate-500">DEVICE ID:</span> {selectedLog.device_id}</div>
              <div><span className="text-slate-500">IP ADDRESS:</span> {selectedLog.ip_address}</div>
              <div><span className="text-slate-500">LOCATION:</span> {selectedLog.city}, {selectedLog.country}</div>
              <div><span className="text-slate-500">USER AGENT:</span> {selectedLog.user_agent}</div>
              <div><span className="text-slate-500">IS FLAGGED:</span> {selectedLog.is_flagged ? 'TRUE' : 'FALSE'}</div>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};
