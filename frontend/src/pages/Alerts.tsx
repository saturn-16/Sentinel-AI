import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Filter, CheckCircle2, XCircle, UserCheck } from 'lucide-react';
import { alertService } from '../services/api';
import { Alert } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const Alerts: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['soc-alerts', severityFilter, statusFilter],
    queryFn: () => alertService.getAlerts({ severity: severityFilter || undefined, status: statusFilter || undefined, size: 50 }),
    refetchInterval: 5000,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => alertService.updateAlertStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['soc-alerts'] });
    },
  });

  if (isLoading || !data) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            SOC Alert Triage & Response
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage, assign, and resolve automated behavioral anomaly alerts</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-[#1A2234] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none"
          >
            <option value="">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1A2234] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Dismissed">Dismissed</option>
          </select>
        </div>
      </div>

      <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#1A2234] text-slate-400 font-semibold uppercase border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">Alert Title</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Assigned Analyst</th>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3 text-right">Quick Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
            {data.items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No alerts matching specified triage criteria.
                </td>
              </tr>
            ) : (
              data.items.map((alert: Alert) => (
                <tr key={alert.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-100 cursor-pointer" onClick={() => navigate(`/alerts/${alert.id}`)}>
                    {alert.title}
                  </td>
                  <td className="px-4 py-3">
                    <RiskBadge level={alert.severity} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={alert.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-400 font-mono">{alert.assigned_to || 'Unassigned'}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{new Date(alert.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => navigate(`/alerts/${alert.id}`)}
                      className="px-2.5 py-1 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 font-semibold text-[11px]"
                    >
                      Investigate
                    </button>
                    {alert.status !== 'Resolved' && (
                      <button
                        onClick={() => updateMutation.mutate({ id: alert.id, status: 'Resolved' })}
                        className="px-2.5 py-1 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/50 hover:bg-emerald-900/50 font-semibold text-[11px]"
                      >
                        Resolve
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
