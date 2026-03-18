import { EmptyState } from '@/components/EmptyState';
import BluetoothIcon from '@/assets/bluetooth.svg';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

interface DeviceUsageSessionsChartProps {
  hasData: boolean;
}

const deviceSessionData = [
  { name: 'D - 103', sessions: 120 },
  { name: 'D - 118', sessions: 95 },
  { name: 'D - 107', sessions: 78 },
  { name: 'D - 089', sessions: 50 },
  { name: 'D - 074', sessions: 32 },
];

export function DeviceUsageSessionsChart({ hasData }: DeviceUsageSessionsChartProps) {
  if (!hasData) {
    return <EmptyState icon={BluetoothIcon} message="No devices added yet" />;
  }

  const maxSessions = Math.max(...deviceSessionData.map(d => d.sessions));

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart 
          data={deviceSessionData} 
          layout="vertical"
          margin={{ top: 5, right: 80, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
          <XAxis 
            type="number" 
            domain={[0, maxSessions + 50]}
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
            dataKey="name"
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
            {deviceSessionData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill="#8b5cf6" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
