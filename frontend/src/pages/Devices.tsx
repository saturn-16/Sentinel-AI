import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { HardDrive, ShieldCheck, ShieldAlert } from 'lucide-react';
import { deviceService } from '../services/api';
import { Device } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const DevicesPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: devices, isLoading } = useQuery({
    queryKey: ['soc-devices'],
    queryFn: () => deviceService.getDevices(),
  });

  const trustMutation = useMutation({
    mutationFn: ({ id, is_trusted }: { id: string; is_trusted: boolean }) =>
      deviceService.updateTrustStatus(id, is_trusted),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['soc-devices'] });
    },
  });

  if (isLoading || !devices) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-blue-400" />
          Enterprise Device & Endpoint Inventory
        </h1>
        <p className="text-xs text-slate-400 mt-1">Manage trusted device fingerprints, MAC addresses, and OS security policies</p>
      </div>

      <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#1A2234] text-slate-400 font-semibold uppercase border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">Device Name</th>
              <th className="px-4 py-3">Operating System</th>
              <th className="px-4 py-3">Browser</th>
              <th className="px-4 py-3">MAC Address</th>
              <th className="px-4 py-3">Trust Score</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Trust Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
            {devices.map((device: Device) => (
              <tr key={device.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-3 font-bold text-slate-100">{device.device_name}</td>
                <td className="px-4 py-3 text-slate-300">{device.os}</td>
                <td className="px-4 py-3 text-slate-400">{device.browser}</td>
                <td className="px-4 py-3 font-mono text-slate-400">{device.mac_address}</td>
                <td className="px-4 py-3 font-bold text-emerald-400">{device.trust_score}%</td>
                <td className="px-4 py-3">
                  <StatusBadge status={device.is_trusted ? 'TRUSTED' : 'UNTRUSTED'} />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => trustMutation.mutate({ id: device.id, is_trusted: !device.is_trusted })}
                    className={`px-3 py-1 rounded text-[11px] font-bold border transition-colors ${
                      device.is_trusted
                        ? 'bg-red-950/40 text-red-400 border-red-800/50 hover:bg-red-900/50'
                        : 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50 hover:bg-emerald-900/50'
                    }`}
                  >
                    {device.is_trusted ? 'Revoke Trust' : 'Mark Trusted'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
