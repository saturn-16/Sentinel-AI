import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface AttackTimelineChartProps {
  data: Record<string, number>;
}

export const AttackTimelineChart: React.FC<AttackTimelineChartProps> = ({ data }) => {
  const chartData = Object.entries(data).map(([type, count]) => ({
    name: type,
    count: count,
  }));

  return (
    <div className="w-full h-64 font-mono text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis dataKey="name" stroke="#6b7280" fontSize={10} angle={-15} textAnchor="end" tickLine={false} />
          <YAxis stroke="#6b7280" fontSize={11} tickLine={false} />
          <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#000000', borderWidth: '2px', borderRadius: '0px', color: '#000000', fontWeight: 'bold' }} />
          <Bar dataKey="count" fill="#ef4444" radius={[0, 0, 0, 0]} name="Injected Attacks" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
