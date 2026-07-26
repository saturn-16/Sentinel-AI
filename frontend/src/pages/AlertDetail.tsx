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
    <div className="space-y-6 text-slate-900 font-sans">
      <div className="flex items-center justify-between border-b-2 border-black pb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 border border-black bg-white text-black hover:bg-black hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-black tracking-tight uppercase">{alert.title}</h1>
            <p className="font-mono text-xs text-slate-600 uppercase">Alert Ref ID: {alert.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <RiskBadge level={alert.severity} size="md" />
          <StatusBadge status={alert.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border-2 border-black p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <h2 className="text-sm font-black text-black uppercase flex items-center gap-2">
                <Layers className="w-4 h-4 text-red-600" />
                MITRE ATT&CK Framework Mapping
              </h2>
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-red-50 text-red-600 border border-red-300 uppercase">
                {mitre.technique_id}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-300">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">TACTIC</span>
                <span className="text-black font-bold">{mitre.tactic}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-300">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">TECHNIQUE</span>
                <span className="text-black font-bold">{mitre.technique}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-300">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">TECHNIQUE ID</span>
                <span className="text-red-600 font-bold">{mitre.technique_id}</span>
              </div>
            </div>

            <p className="text-xs text-slate-700 bg-slate-50 p-3 border border-slate-300 leading-relaxed uppercase">
              {mitre.description}
            </p>
          </div>

          <div className="bg-white border-2 border-black p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-black uppercase border-b-2 border-black pb-3">
              Explainability Engine Findings
            </h2>
            <div className="p-4 bg-red-50 border-2 border-red-300 space-y-3">
              <h3 className="font-bold text-black text-sm uppercase">{exp.summary_text || alert.title}</h3>
              <div className="space-y-2">
                {exp.reasons?.map((reason: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-800">
                    <AlertOctagon className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-black p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-black uppercase border-b-2 border-black pb-3">
              Recommended Remediation Protocol
            </h2>
            <div className="p-4 bg-white border-2 border-black space-y-2">
              {exp.suggested_actions?.map((act: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-emerald-700 font-bold">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border-2 border-black p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-black uppercase border-b-2 border-black pb-3">
              SOC Analyst Investigation Log & Notes
            </h2>
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={analystNote}
                onChange={(e) => setAnalystNote(e.target.value)}
                placeholder="Add SOC investigation note or hypothesis..."
                className="flex-1 bg-slate-50 border border-slate-300 px-3 py-2 text-xs text-black focus:outline-none focus:border-black"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-black hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Add Note
              </button>
            </form>
            <div className="space-y-2">
              {notesList.map((n, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-300 text-xs flex justify-between">
                  <span className="text-black">{n.note}</span>
                  <span className="text-[10px] font-mono text-slate-500 ml-4">{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border-2 border-black p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-black uppercase border-b-2 border-black pb-3">Triage Controls</h2>
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase block">Status Transition:</label>
              <div className="grid grid-cols-2 gap-2">
                {['Open', 'In Progress', 'Resolved', 'Dismissed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => updateMutation.mutate(st)}
                    className={`px-3 py-2 text-xs font-bold uppercase transition-colors ${
                      alert.status === st
                        ? 'bg-black text-white'
                        : 'bg-slate-100 text-black border border-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {user && (
            <div className="bg-white border-2 border-black p-6 shadow-sm space-y-3">
              <h2 className="text-sm font-black text-black uppercase border-b-2 border-black pb-3">Entity Context</h2>
              <div className="flex items-center gap-3">
                <div className="p-2 border border-black bg-red-50 text-red-600">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-black uppercase">{user.full_name}</div>
                  <div className="text-[11px] text-slate-600">{user.email}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
