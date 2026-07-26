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
    <div className="space-y-6 text-slate-900 font-sans">
      <div className="border-b-2 border-black pb-4">
        <h1 className="text-2xl font-black text-black tracking-tight flex items-center gap-2 uppercase">
          <UsersIcon className="w-5 h-5 text-red-600" />
          ENTERPRISE USER DIRECTORY & RISK PROFILES
        </h1>
        <p className="font-mono text-xs text-slate-600 mt-1 uppercase">Continuous behavioral risk baselines across monitored employees</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 border-2 border-black font-mono text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by full name or email address..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 pl-9 pr-4 py-2 text-xs font-mono text-black placeholder-slate-500 focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs font-mono font-bold text-black uppercase focus:outline-none"
          >
            <option value="">All Departments</option>
            <option value="Security Operations">Security Operations</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="Cloud Infrastructure">Cloud Infrastructure</option>
            <option value="Finance & HR">Finance & HR</option>
          </select>
        </div>
      </div>

      <div className="bg-white border-2 border-black overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-100 text-black font-bold uppercase border-b-2 border-black">
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
          <tbody className="divide-y divide-slate-200 font-medium">
            {data.items.map((u: User) => (
              <tr
                key={u.id}
                onClick={() => navigate(`/users/${u.id}`)}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 font-bold text-black">{u.full_name}</td>
                <td className="px-4 py-3 font-mono text-slate-600">{u.email}</td>
                <td className="px-4 py-3 text-slate-700">{u.department}</td>
                <td className="px-4 py-3 text-slate-700">{u.role}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${u.privilege_level === 'Admin' ? 'bg-red-50 text-red-600 border-red-300' : 'bg-slate-100 text-slate-700 border-slate-300'}`}>
                    {u.privilege_level}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <RiskBadge score={u.current_risk_score} size="sm" />
                </td>
                <td className="px-4 py-3 text-right">
                  <ChevronRight className="w-4 h-4 text-slate-600 inline-block" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
