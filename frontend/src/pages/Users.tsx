import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Users as UsersIcon, Search, Shield, ChevronRight } from 'lucide-react';
import { userService } from '../services/api';
import { User } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['soc-users', query, department],
    queryFn: () => userService.getUsers({ query: query || undefined, department: department || undefined, size: 50 }),
  });

  if (isLoading || !data) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
          <UsersIcon className="w-5 h-5 text-blue-400" />
          Enterprise User Directory & Risk Profiles
        </h1>
        <p className="text-xs text-slate-400 mt-1">Continuous behavioral risk baselines across monitored employees</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#111827] p-4 rounded-xl border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by full name or email address..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#1A2234] border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-100 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full bg-[#1A2234] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none"
          >
            <option value="">All Departments</option>
            <option value="Security Operations">Security Operations</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="Cloud Infrastructure">Cloud Infrastructure</option>
            <option value="Finance & HR">Finance & HR</option>
          </select>
        </div>
      </div>

      <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#1A2234] text-slate-400 font-semibold uppercase border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">Employee Name</th>
              <th className="px-4 py-3">Email Address</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Privilege Level</th>
              <th className="px-4 py-3">Current Risk Score</th>
              <th className="px-4 py-3 text-right">View Profile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
            {data.items.map((u: User) => (
              <tr
                key={u.id}
                onClick={() => navigate(`/users/${u.id}`)}
                className="hover:bg-slate-800/40 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 font-bold text-slate-100">{u.full_name}</td>
                <td className="px-4 py-3 font-mono text-slate-400">{u.email}</td>
                <td className="px-4 py-3">{u.department}</td>
                <td className="px-4 py-3 text-slate-300">{u.role}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${u.privilege_level === 'Admin' ? 'bg-purple-950/50 text-purple-400 border-purple-800' : 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                    {u.privilege_level}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <RiskBadge score={u.current_risk_score} size="sm" />
                </td>
                <td className="px-4 py-3 text-right">
                  <ChevronRight className="w-4 h-4 text-slate-400 inline-block" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
