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
    <div className="space-y-6 text-slate-900 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-black pb-4">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight flex items-center gap-2 uppercase">
            <FileText className="w-5 h-5 text-red-600" />
            SOC INCIDENT MANAGEMENT CASES
          </h1>
          <p className="font-mono text-xs text-slate-600 mt-1 uppercase">Lifecycle tracking and resolution workflows for enterprise threats</p>
        </div>

        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-red-600 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>New Incident Case</span>
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleSubmit} className="p-5 bg-white border-2 border-black space-y-4 font-mono text-xs">
          <h2 className="text-sm font-black text-black uppercase">Create New Incident Case File</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-600 block mb-1 uppercase">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Credential Stuffing & Unauthorized Data Access"
                className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs text-black focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="font-bold text-slate-600 block mb-1 uppercase">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs font-bold text-black uppercase focus:outline-none"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
          <div>
            <label className="font-bold text-slate-600 block mb-1 uppercase">Description & Initial Findings</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe anomalous behavior timeline, compromised entities, and remediation steps taken..."
              className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs text-black focus:outline-none focus:border-black"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="px-3 py-1.5 border border-black text-black font-bold uppercase hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-black text-white hover:bg-red-600 font-bold uppercase"
            >
              Create Incident
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border-2 border-black overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-100 text-black font-bold uppercase border-b-2 border-black">
            <tr>
              <th className="px-4 py-3">Incident Title</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Assigned Lead</th>
              <th className="px-4 py-3">Created Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-medium">
            {data.items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500 uppercase">
                  No active incidents recorded.
                </td>
              </tr>
            ) : (
              data.items.map((inc: Incident) => (
                <tr key={inc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-black">{inc.title}</td>
                  <td className="px-4 py-3">
                    <RiskBadge level={inc.severity} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={inc.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-mono">{inc.assigned_to || 'Unassigned'}</td>
                  <td className="px-4 py-3 font-mono text-slate-600">{new Date(inc.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
