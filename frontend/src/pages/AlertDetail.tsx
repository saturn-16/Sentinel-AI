import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShieldAlert, ArrowLeft, CheckCircle, AlertOctagon, User, HardDrive, FileText } from 'lucide-react';
import { alertService } from '../services/api';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const AlertDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: alert, isLoading } = useQuery({
    queryKey: ['alert-detail', id],
    queryFn: () => alertService.getAlertById(id!),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (status: string) => alertService.updateAlertStatus(id!, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert-detail', id] });
    },
  });

  if (isLoading || !alert) {
    return <LoadingSkeleton />;
  }

  const exp = alert.explanation || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">{alert.title}</h1>
          <p className="text-xs text-slate-400">Alert Identifier: {alert.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#111827] p-5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Risk Level</span>
          <div><RiskBadge level={alert.severity} size="lg" /></div>
        </div>
        <div className="bg-[#111827] p-5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Status</span>
          <div><StatusBadge status={alert.status} /></div>
        </div>
        <div className="bg-[#111827] p-5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Attack Classification</span>
          <div className="text-lg font-bold text-slate-100">{alert.event_type}</div>
        </div>
        <div className="bg-[#111827] p-5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Assigned Analyst</span>
          <div className="text-sm font-bold text-blue-400">{alert.assigned_to || 'Unassigned'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111827] p-6 rounded-xl border border-slate-800 space-y-6">
          <h2 className="text-base font-bold text-slate-100 border-b border-slate-800 pb-3">
            Explainability Engine Summary
          </h2>

          <div className="p-4 rounded-xl bg-[#141C2D] border border-blue-500/30 space-y-3">
            <h3 className="font-bold text-slate-100 text-sm">{exp.summary_text || alert.title}</h3>
            <div className="space-y-2">
              {exp.reasons?.map((reason: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                  <AlertOctagon className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Recommended Remediation Steps</h3>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              {exp.suggested_actions?.map((act: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#111827] p-6 rounded-xl border border-slate-800 space-y-6">
          <h2 className="text-base font-bold text-slate-100 border-b border-slate-800 pb-3">Triage Controls</h2>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-400 block">Update Status:</label>
            <div className="grid grid-cols-2 gap-2">
              {['Open', 'In Progress', 'Resolved', 'Dismissed'].map((st) => (
                <button
                  key={st}
                  onClick={() => updateMutation.mutate(st)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${
                    alert.status === st
                      ? 'bg-blue-600/20 text-blue-400 border-blue-500'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {alert.user && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Target Entity</span>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-xs font-bold text-slate-100">{alert.user.full_name}</div>
                  <div className="text-[11px] text-slate-500">{alert.user.email}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
