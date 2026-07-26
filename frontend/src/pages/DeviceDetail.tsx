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
    <div className="space-y-6 text-slate-900 font-sans">
      <div className="flex items-center gap-4 border-b-2 border-black pb-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 border border-black bg-white text-black hover:bg-black hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight uppercase">{device.device_name}</h1>
          <p className="font-mono text-xs text-slate-600 uppercase">MAC: {device.mac_address}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <div className="bg-white border-2 border-black p-5 space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Device Trust Score</span>
          <div className="text-3xl font-black text-red-600">{device.trust_score}%</div>
        </div>
        <div className="bg-white border-2 border-black p-5 space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Operating System</span>
          <div className="text-xl font-bold text-black uppercase">{device.os}</div>
        </div>
        <div className="bg-white border-2 border-black p-5 space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Browser Fingerprint</span>
          <div className="text-xl font-bold text-black uppercase">{device.browser}</div>
        </div>
      </div>
    </div>
  );
};
