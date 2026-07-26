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
    <div className="space-y-6 text-slate-900 font-sans">
      <div className="border-b-2 border-black pb-4">
        <h1 className="text-2xl font-black text-black tracking-tight flex items-center gap-2 uppercase">
          <HardDrive className="w-5 h-5 text-red-600" />
          ENTERPRISE DEVICE & ENDPOINT INVENTORY
        </h1>
        <p className="font-mono text-xs text-slate-600 mt-1 uppercase">Manage trusted device fingerprints, MAC addresses, and OS security policies</p>
      </div>

      <div className="bg-white border-2 border-black overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-100 text-black font-bold uppercase border-b-2 border-black">
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
          <tbody className="divide-y divide-slate-200 font-medium">
            {devices.map((device: Device) => (
              <tr key={device.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-bold text-black">{device.device_name}</td>
                <td className="px-4 py-3 text-slate-700">{device.os}</td>
                <td className="px-4 py-3 text-slate-600">{device.browser}</td>
                <td className="px-4 py-3 font-mono text-slate-600">{device.mac_address}</td>
                <td className="px-4 py-3 font-bold text-black">{device.trust_score}/100</td>
                <td className="px-4 py-3">
                  <StatusBadge status={device.is_trusted ? 'SUCCESS' : 'FAILED'} />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => trustMutation.mutate({ id: device.id, is_trusted: !device.is_trusted })}
                    className={`px-3 py-1 font-bold text-[10px] uppercase border transition-colors ${
                      device.is_trusted
                        ? 'bg-red-50 text-red-600 border-red-300 hover:bg-red-600 hover:text-white'
                        : 'bg-black text-white hover:bg-red-600'
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
