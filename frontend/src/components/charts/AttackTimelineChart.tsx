import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface AttackTimelineChartProps {
  data: Record<string, number>;
}

export const AttackTimelineChart: React.FC<AttackTimelineChartProps> = ({ data }) => {
  const chartData = Object.entries(data).map(([type, count]) => ({
    name: type,
    count: count,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
          <XAxis dataKey="name" stroke="#6B7280" fontSize={10} angle={-15} textAnchor="end" tickLine={false} />
          <YAxis stroke="#6B7280" fontSize={11} tickLine={false} />
          <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#F3F4F6' }} />
          <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} name="Injected Attacks" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
