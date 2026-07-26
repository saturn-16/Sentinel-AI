import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle, AlertOctagon, User, HardDrive, Shield, FileText, Send, Clock, Layers } from 'lucide-react';
import { alertService, userService, deviceService } from '../services/api';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const AlertDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [analystNote, setAnalystNote] = useState('');
  const [notesList, setNotesList] = useState<Array<{ time: string; note: string }>>([
    { time: '10:14:02 AM', note: 'Initial alert triaged by SOC Tier 1 Automated Pipeline.' }
  ]);

  const { data: alert, isLoading } = useQuery({
    queryKey: ['alert-detail', id],
    queryFn: () => alertService.getAlertById(id!),
    enabled: !!id,
  });

  const { data: user } = useQuery({
    queryKey: ['alert-user', alert?.user_id],
    queryFn: () => userService.getUserById(alert!.user_id),
    enabled: !!alert?.user_id,
  });

  const updateMutation = useMutation({
    mutationFn: (status: string) => alertService.updateAlertStatus(id!, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert-detail', id] });
    },
  });

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!analystNote.trim()) return;
    setNotesList([{ time: new Date().toLocaleTimeString(), note: analystNote }, ...notesList]);
    setAnalystNote('');
  };

  if (isLoading || !alert) {
    return <LoadingSkeleton />;
  }

  const exp = alert.explanation || {};
  const mitre = exp.mitre_attack || {
    tactic: 'TA0006 - Credential Access',
    technique: 'Brute Force',
    technique_id: 'T1110',
    description: 'Adversaries may attempt to gain access to accounts by systematically guessing passwords.'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">{alert.title}</h1>
            <p className="text-xs text-slate-400">Alert Ref ID: {alert.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <RiskBadge level={alert.severity} size="md" />
          <StatusBadge status={alert.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111827] p-6 rounded-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                MITRE ATT&CK Framework Mapping
              </h2>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-950/60 text-blue-400 border border-blue-800">
                {mitre.technique_id}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">TACTIC</span>
                <span className="text-slate-200 font-bold">{mitre.tactic}</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">TECHNIQUE</span>
                <span className="text-slate-200 font-bold">{mitre.technique}</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[10px]">TECHNIQUE ID</span>
                <span className="text-blue-400 font-bold">{mitre.technique_id}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
              {mitre.description}
            </p>
          </div>

          <div className="bg-[#111827] p-6 rounded-xl border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">
              Explainability Engine Findings
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
          </div>

          <div className="bg-[#111827] p-6 rounded-xl border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">
              Recommended Remediation Protocol
            </h2>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              {exp.suggested_actions?.map((act: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111827] p-6 rounded-xl border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">
              SOC Analyst Investigation Log & Notes
            </h2>
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={analystNote}
                onChange={(e) => setAnalystNote(e.target.value)}
                placeholder="Add SOC investigation note or hypothesis..."
                className="flex-1 bg-[#1A2234] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Add Note
              </button>
            </form>
            <div className="space-y-2">
              {notesList.map((n, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs flex justify-between">
                  <span className="text-slate-200">{n.note}</span>
                  <span className="text-[10px] font-mono text-slate-500 ml-4">{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#111827] p-6 rounded-xl border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">Triage Controls</h2>
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-400 block">Status Transition:</label>
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
          </div>

          {user && (
            <div className="bg-[#111827] p-6 rounded-xl border border-slate-800 space-y-3">
              <h2 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">Entity Context</h2>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-100">{user.full_name}</div>
                  <div className="text-[11px] text-slate-400">{user.email}</div>
                  <div className="text-[10px] text-slate-500">{user.department} • {user.role}</div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">User Risk Score:</span>
                <RiskBadge score={user.current_risk_score} size="sm" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
