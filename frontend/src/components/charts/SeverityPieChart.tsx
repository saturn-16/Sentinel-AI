import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface SeverityPieChartProps {
  data: Record<string, number>;
}

const COLORS: Record<string, string> = {
  Low: '#10b981',
  Medium: '#f59e0b',
  High: '#f97316',
  Critical: '#ef4444',
};

export const SeverityPieChart: React.FC<SeverityPieChartProps> = ({ data }) => {
  const chartData = Object.entries(data).map(([severity, count]) => ({
    name: severity,
    value: count,
  }));

  return (
    <div className="w-full h-64 font-mono text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#ef4444'} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#000000', borderWidth: '2px', borderRadius: '0px', color: '#000000', fontWeight: 'bold' }} />
          <Legend verticalAlign="bottom" height={36} iconType="square" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
