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
    <div className="space-y-6 text-slate-900 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-black pb-4">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight flex items-center gap-2 uppercase">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            SOC ALERT TRIAGE & RESPONSE
          </h1>
          <p className="font-mono text-xs text-slate-600 mt-1 uppercase">Manage, assign, and resolve automated behavioral anomaly alerts</p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-white border-2 border-black px-3 py-1.5 font-bold text-black uppercase focus:outline-none"
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
            className="bg-white border-2 border-black px-3 py-1.5 font-bold text-black uppercase focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Dismissed">Dismissed</option>
          </select>
        </div>
      </div>

      <div className="bg-white border-2 border-black overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-100 text-black font-bold uppercase border-b-2 border-black">
            <tr>
              <th className="px-4 py-3">Alert Title</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Assigned Analyst</th>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3 text-right">Quick Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-medium">
            {data.items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500 uppercase">
                  No alerts matching specified triage criteria.
                </td>
              </tr>
            ) : (
              data.items.map((alert: Alert) => (
                <tr key={alert.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-black cursor-pointer" onClick={() => navigate(`/alerts/${alert.id}`)}>
                    {alert.title}
                  </td>
                  <td className="px-4 py-3">
                    <RiskBadge level={alert.severity} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={alert.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-mono">{alert.assigned_to || 'Unassigned'}</td>
                  <td className="px-4 py-3 font-mono text-slate-600">{new Date(alert.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => navigate(`/alerts/${alert.id}`)}
                      className="px-2.5 py-1 bg-black text-white hover:bg-red-600 font-bold text-[11px] uppercase"
                    >
                      Investigate
                    </button>
                    {alert.status !== 'Resolved' && (
                      <button
                        onClick={() => updateMutation.mutate({ id: alert.id, status: 'Resolved' })}
                        className="px-2.5 py-1 border border-black text-black hover:bg-black hover:text-white font-bold text-[11px] uppercase"
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
