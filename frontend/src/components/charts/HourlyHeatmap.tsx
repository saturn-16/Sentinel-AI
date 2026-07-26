import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface HourlyHeatmapProps {
  data: Array<{ hour: string; normal: number; anomalous: number }>;
}

export const HourlyHeatmap: React.FC<HourlyHeatmapProps> = ({ data }) => {
  return (
    <div className="w-full h-64 font-mono text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis dataKey="hour" stroke="#6b7280" fontSize={10} tickLine={false} />
          <YAxis stroke="#6b7280" fontSize={11} tickLine={false} />
          <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#000000', borderWidth: '2px', borderRadius: '0px', color: '#000000', fontWeight: 'bold' }} />
          <Bar dataKey="normal" stackId="a" fill="#000000" name="Normal Activity" />
          <Bar dataKey="anomalous" stackId="a" fill="#ef4444" name="Anomalous Activity" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
