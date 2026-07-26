import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface RiskTrendChartProps {
  data: Array<{ time: string; avg_score: number; alerts: number }>;
}

export const RiskTrendChart: React.FC<RiskTrendChartProps> = ({ data }) => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis dataKey="time" stroke="#6b7280" fontSize={11} tickLine={false} />
          <YAxis stroke="#6b7280" fontSize={11} tickLine={false} domain={[0, 100]} />
          <Tooltip
            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#000000', borderWidth: '2px', borderRadius: '0px', color: '#000000', fontWeight: 'bold' }}
          />
          <Area type="monotone" dataKey="avg_score" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#riskGrad)" name="Average Risk Score" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
