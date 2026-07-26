import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, Plus, CheckCircle, Shield } from 'lucide-react';
import { incidentService } from '../services/api';
import { Incident } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const Incidents: React.FC = () => {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('High');

  const { data, isLoading } = useQuery({
    queryKey: ['soc-incidents'],
    queryFn: () => incidentService.getIncidents({ size: 50 }),
  });

  const createMutation = useMutation({
    mutationFn: incidentService.createIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['soc-incidents'] });
      setShowCreate(false);
      setTitle('');
      setDescription('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    createMutation.mutate({ title, description, severity });
  };

  if (isLoading || !data) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            SOC Incident Management Cases
          </h1>
          <p className="text-xs text-slate-400 mt-1">Lifecycle tracking and resolution workflows for enterprise threats</p>
        </div>

        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Incident Case</span>
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleSubmit} className="p-5 rounded-xl bg-[#111827] border border-blue-500/40 space-y-4">
          <h2 className="text-sm font-bold text-slate-100">Create New Incident Case File</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Credential Stuffing & Unauthorized Data Access"
                className="w-full bg-[#1A2234] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-[#1A2234] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Description & Initial Findings</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe anomalous behavior timeline, compromised entities, and remediation steps taken..."
              className="w-full bg-[#1A2234] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-blue-600 text-xs font-bold text-white hover:bg-blue-500"
            >
              Create Incident
            </button>
          </div>
        </form>
      )}

      <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#1A2234] text-slate-400 font-semibold uppercase border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">Incident Title</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Assigned Lead</th>
              <th className="px-4 py-3">Created Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
            {data.items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No active incidents recorded.
                </td>
              </tr>
            ) : (
              data.items.map((inc: Incident) => (
                <tr key={inc.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-100">{inc.title}</td>
                  <td className="px-4 py-3">
                    <RiskBadge level={inc.severity} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={inc.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-400 font-mono">{inc.assigned_to || 'Unassigned'}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{new Date(inc.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
