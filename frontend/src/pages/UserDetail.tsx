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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">{user.full_name}</h1>
          <p className="text-xs text-slate-400">{user.email} • {user.department}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#111827] p-5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Current Risk Score</span>
          <div><RiskBadge score={user.current_risk_score} size="lg" /></div>
        </div>
        <div className="bg-[#111827] p-5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Privilege Level</span>
          <div className="text-sm font-bold text-slate-100">{user.privilege_level}</div>
        </div>
        <div className="bg-[#111827] p-5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Work Pattern</span>
          <div className="text-sm font-bold text-blue-400">{user.work_pattern}</div>
        </div>
        <div className="bg-[#111827] p-5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Behavior Consistency</span>
          <div className="text-lg font-bold text-emerald-400">{profile?.behavior_consistency_score || 94.5}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111827] p-6 rounded-xl border border-slate-800 space-y-6">
          <h2 className="text-base font-bold text-slate-100 border-b border-slate-800 pb-3">
            Learned Behavioral Baseline Profile
          </h2>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-bold uppercase flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-400" /> Normal Login Hours
              </span>
              <div className="text-slate-200 font-mono">
                {profile?.normal_login_hours?.hours?.join(':00, ')}:00
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-bold uppercase flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-400" /> Trusted Countries
              </span>
              <div className="text-slate-200 font-mono">
                {profile?.normal_countries?.countries?.join(', ')}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Recent Authentication Log Trail</h3>
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1A2234] text-slate-400 font-semibold">
                  <tr>
                    <th className="px-3 py-2">Timestamp</th>
                    <th className="px-3 py-2">IP Address</th>
                    <th className="px-3 py-2">Location</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {logs?.items?.map((log) => (
                    <tr key={log.id}>
                      <td className="px-3 py-2 font-mono text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="px-3 py-2 font-mono">{log.ip_address}</td>
                      <td className="px-3 py-2">{log.city}, {log.country}</td>
                      <td className="px-3 py-2"><StatusBadge status={log.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-[#111827] p-6 rounded-xl border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-slate-100 border-b border-slate-800 pb-3">Associated Devices</h2>
          <div className="space-y-3">
            {devices?.map((d) => (
              <div key={d.id} className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-200">{d.device_name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{d.mac_address}</div>
                </div>
                <StatusBadge status={d.is_trusted ? 'TRUSTED' : 'UNTRUSTED'} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
