import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface HourlyHeatmapProps {
  data: Array<{ hour: string; normal: number; anomalous: number }>;
}

export const HourlyHeatmap: React.FC<HourlyHeatmapProps> = ({ data }) => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
          <XAxis dataKey="hour" stroke="#6B7280" fontSize={10} tickLine={false} />
          <YAxis stroke="#6B7280" fontSize={11} tickLine={false} />
          <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#F3F4F6' }} />
          <Bar dataKey="normal" stackId="a" fill="#10b981" name="Normal Activity" />
          <Bar dataKey="anomalous" stackId="a" fill="#ef4444" name="Anomalous Activity" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
