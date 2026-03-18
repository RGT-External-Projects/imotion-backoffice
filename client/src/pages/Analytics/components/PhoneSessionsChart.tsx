import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { Smartphone } from 'lucide-react';

interface PhoneSessionsChartProps {
  hasData: boolean;
}

const phoneSessionData = [
  { phone: 'P - 021', sessions: 19 },
  { phone: 'P - 345', sessions: 8 },
  { phone: 'P - 233', sessions: 6 },
  { phone: 'P - 003', sessions: 2 },
  { phone: 'P - 419', sessions: 2 },
];

export function PhoneSessionsChart({ hasData }: PhoneSessionsChartProps) {
  if (!hasData) {
    return (
      <div className="h-[280px] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
          <Smartphone className="h-6 w-6 text-blue-500" />
        </div>
        <p className="text-sm text-muted-foreground">No data available</p>
      </div>
    );
  }

  const maxSessions = Math.max(...phoneSessionData.map(d => d.sessions));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart 
        data={phoneSessionData} 
        layout="vertical"
        margin={{ top: 5, right: 60, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
        <XAxis 
          type="number" 
          domain={[0, maxSessions + 30]}
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          axisLine={false}
          tickLine={false}
          label={{ 
            value: 'Number of Sessions', 
            position: 'bottom',
            offset: -10,
            style: { fontSize: 11, fill: '#6b7280' }
          }}
        />
        <YAxis 
          type="category" 
          dataKey="phone"
          tick={{ fontSize: 14, fill: '#1f2937' }}
          axisLine={false}
          tickLine={false}
          width={60}
        />
        <Bar 
          dataKey="sessions" 
          radius={[0, 4, 4, 0]}
          barSize={16}
          background={{ fill: '#f3f4f6' }}
          label={{ 
            position: 'right', 
            fill: '#1f2937', 
            fontSize: 14,
            fontWeight: 500
          }}
        >
          {phoneSessionData.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill="#3b82f6" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
