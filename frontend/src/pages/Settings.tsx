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
    <div className="space-y-6 max-w-4xl text-slate-900 font-sans">
      <div className="border-b-2 border-black pb-4">
        <h1 className="text-2xl font-black text-black tracking-tight flex items-center gap-2 uppercase">
          <SettingsIcon className="w-5 h-5 text-red-600" />
          SENTINELAI PLATFORM & ML ENGINE SETTINGS
        </h1>
        <p className="font-mono text-xs text-slate-600 mt-1 uppercase">Configure anomaly detection thresholds, alert sensitivities, and security policies</p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border-2 border-emerald-600 text-emerald-800 text-xs font-bold font-mono uppercase">
          Settings updated successfully! ML engine parameters reloaded.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 font-mono text-xs">
        <div className="bg-white p-6 border-2 border-black space-y-4 shadow-sm">
          <h2 className="text-sm font-black text-black uppercase border-b-2 border-black pb-3 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-red-600" /> Machine Learning Model Parameters
          </h2>

          <div className="space-y-4">
            <div>
              <label className="font-bold text-black block mb-1 uppercase">
                Isolation Forest Contamination Ratio ({contamination})
              </label>
              <input
                type="range"
                min="0.01"
                max="0.20"
                step="0.01"
                value={contamination}
                onChange={(e) => setContamination(e.target.value)}
                className="w-full h-2 bg-slate-200 border border-black cursor-pointer accent-red-600"
              />
              <span className="text-slate-500 text-[11px] uppercase">Controls expected baseline outlier percentage in authentication stream</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-black block mb-1 uppercase">High Risk Threshold Score</label>
                <input
                  type="number"
                  value={highRiskThreshold}
                  onChange={(e) => setHighRiskThreshold(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs font-bold text-black focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="font-bold text-black block mb-1 uppercase">Critical Risk Threshold Score</label>
                <input
                  type="number"
                  value={criticalRiskThreshold}
                  onChange={(e) => setCriticalRiskThreshold(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs font-bold text-black focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
