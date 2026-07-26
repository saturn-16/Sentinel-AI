import React from 'react';
import { FileText, Download, Printer } from 'lucide-react';

export const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            SOC Executive Threat & Compliance Reports
          </h1>
          <p className="text-xs text-slate-400 mt-1">Export downloadable audit summaries for Honeywell CISOs and Security Governance</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors">
            <Download className="w-4 h-4" /> Export Executive PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Weekly Threat Landscape Report', date: 'July 26, 2026', type: 'PDF Audit' },
          { title: 'ISO 27001 Access Anomaly Summary', date: 'July 20, 2026', type: 'Compliance CSV' },
          { title: 'NIST CSF Incident Response Log', date: 'July 15, 2026', type: 'PDF Audit' },
        ].map((r, i) => (
          <div key={i} className="bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <FileText className="w-6 h-6 text-blue-400" />
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">{r.type}</span>
            </div>
            <div>
              <div className="font-bold text-sm text-slate-100">{r.title}</div>
              <div className="text-xs text-slate-400 mt-1">Generated: {r.date}</div>
            </div>
            <button className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 rounded-lg transition-colors">
              Download Artifact
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
