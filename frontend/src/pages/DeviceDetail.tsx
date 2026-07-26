import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, HardDrive, ShieldCheck, ShieldAlert } from 'lucide-react';
import { deviceService } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const DeviceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: device, isLoading } = useQuery({
    queryKey: ['device-detail', id],
    queryFn: () => deviceService.getDeviceById(id!),
    enabled: !!id,
  });

  if (isLoading || !device) {
    return <LoadingSkeleton />;
  }

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
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">{device.device_name}</h1>
          <p className="text-xs text-slate-400">MAC: {device.mac_address}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111827] p-5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Device Trust Score</span>
          <div className="text-2xl font-extrabold text-emerald-400">{device.trust_score}%</div>
        </div>
        <div className="bg-[#111827] p-5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Operating System</span>
          <div className="text-sm font-bold text-slate-100">{device.os}</div>
        </div>
        <div className="bg-[#111827] p-5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Browser Fingerprint</span>
          <div className="text-sm font-bold text-blue-400">{device.browser}</div>
        </div>
      </div>
    </div>
  );
};
