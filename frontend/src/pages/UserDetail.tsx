import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, User as UserIcon, HardDrive, ShieldAlert, Clock, Globe } from 'lucide-react';
import { userService, profileService, deviceService, logService } from '../services/api';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user-detail', id],
    queryFn: () => userService.getUserById(id!),
    enabled: !!id,
  });

  const { data: profile } = useQuery({
    queryKey: ['user-profile', id],
    queryFn: () => profileService.getProfileByUserId(id!),
    enabled: !!id,
  });

  const { data: devices } = useQuery({
    queryKey: ['user-devices', id],
    queryFn: () => deviceService.getDevices({ user_id: id }),
    enabled: !!id,
  });

  const { data: logs } = useQuery({
    queryKey: ['user-logs', id],
    queryFn: () => logService.getAuthLogs({ user_id: id, size: 10 }),
    enabled: !!id,
  });

  if (userLoading || !user) {
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
          <h1 className="text-2xl font-black text-black tracking-tight uppercase">{user.full_name}</h1>
          <p className="font-mono text-xs text-slate-600 uppercase">{user.email} • {user.department}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <div className="bg-white border-2 border-black p-5 space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Current Risk Score</span>
          <div><RiskBadge score={user.current_risk_score} size="lg" /></div>
        </div>
        <div className="bg-white border-2 border-black p-5 space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Privilege Level</span>
          <div className="text-xl font-bold text-black uppercase">{user.privilege_level}</div>
        </div>
        <div className="bg-white border-2 border-black p-5 space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Work Pattern</span>
          <div className="text-xl font-bold text-red-600 uppercase">{user.work_pattern}</div>
        </div>
        <div className="bg-white border-2 border-black p-5 space-y-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Behavior Consistency</span>
          <div className="text-xl font-bold text-black">{profile?.behavior_consistency_score || 94.5}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
        <div className="lg:col-span-2 bg-white border-2 border-black p-6 shadow-sm space-y-6">
          <h2 className="text-base font-black text-black uppercase border-b-2 border-black pb-3">
            Learned Behavioral Baseline Profile
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-300 space-y-2">
              <span className="text-slate-600 font-bold uppercase flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-red-600" /> Normal Login Hours
              </span>
              <div className="text-black font-bold">
                {profile?.normal_login_hours?.hours?.join(':00, ')}:00
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-300 space-y-2">
              <span className="text-slate-600 font-bold uppercase flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-red-600" /> Trusted Countries
              </span>
              <div className="text-black font-bold">
                {profile?.normal_countries?.countries?.join(', ')}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Recent Authentication Log Trail</h3>
            <div className="bg-white border-2 border-black overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-black font-bold uppercase border-b-2 border-black">
                  <tr>
                    <th className="px-3 py-2">Timestamp</th>
                    <th className="px-3 py-2">IP Address</th>
                    <th className="px-3 py-2">Location</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {logs?.items?.map((log) => (
                    <tr key={log.id}>
                      <td className="px-3 py-2 font-mono text-slate-600">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="px-3 py-2 font-mono text-black">{log.ip_address}</td>
                      <td className="px-3 py-2 text-slate-700">{log.city}, {log.country}</td>
                      <td className="px-3 py-2"><StatusBadge status={log.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-black p-6 shadow-sm space-y-4">
          <h2 className="text-base font-black text-black uppercase border-b-2 border-black pb-3">Associated Devices</h2>
          <div className="space-y-3">
            {devices?.map((d) => (
              <div key={d.id} className="p-3 bg-slate-50 border border-slate-300 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-black uppercase">{d.device_name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{d.mac_address}</div>
                </div>
                <StatusBadge status={d.is_trusted ? 'SUCCESS' : 'FAILED'} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
