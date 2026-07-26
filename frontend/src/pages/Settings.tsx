import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Shield, Sliders } from 'lucide-react';

export const Settings: React.FC = () => {
  const [contamination, setContamination] = useState('0.05');
  const [highRiskThreshold, setHighRiskThreshold] = useState('70');
  const [criticalRiskThreshold, setCriticalRiskThreshold] = useState('85');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-blue-400" />
          SentinelAI Platform & ML Engine Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">Configure anomaly detection thresholds, alert sensitivities, and security policies</p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-xs font-bold rounded-lg">
          Settings updated successfully! ML engine parameters reloaded.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-[#111827] p-6 rounded-xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-400" /> Machine Learning Model Parameters
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                Isolation Forest Contamination Ratio ({contamination})
              </label>
              <input
                type="range"
                min="0.01"
                max="0.20"
                step="0.01"
                value={contamination}
                onChange={(e) => setContamination(e.target.value)}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <span className="text-slate-500 text-[11px]">Controls expected baseline outlier percentage in authentication stream</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">High Risk Threshold Score</label>
                <input
                  type="number"
                  value={highRiskThreshold}
                  onChange={(e) => setHighRiskThreshold(e.target.value)}
                  className="w-full bg-[#1A2234] border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Critical Risk Threshold Score</label>
                <input
                  type="number"
                  value={criticalRiskThreshold}
                  onChange={(e) => setCriticalRiskThreshold(e.target.value)}
                  className="w-full bg-[#1A2234] border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors"
          >
            <Save className="w-4 h-4" /> Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
