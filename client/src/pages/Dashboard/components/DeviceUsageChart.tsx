import { EmptyState } from '@/components/EmptyState';
import BluetoothIcon from '@/assets/bluetooth.svg';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DeviceUsageChartProps {
  hasData: boolean;
}

const deviceData = [
  { name: 'D - 103', usage: 85 },
  { name: 'D - 118', usage: 72 },
  { name: 'D - 107', usage: 65 },
  { name: 'D - 089', usage: 48 },
  { name: 'D - 074', usage: 35 },
];

export function DeviceUsageChart({ hasData }: DeviceUsageChartProps) {
  if (!hasData) {
    return <EmptyState icon={BluetoothIcon} message="No devices added yet" />;
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart 
        data={deviceData} 
        layout="vertical"
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
        <XAxis 
          type="number" 
          domain={[0, 100]}
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
          hide
        />
        <YAxis 
          type="category" 
          dataKey="name"
          tick={{ fontSize: 14, fill: '#1f2937' }}
          axisLine={false}
          tickLine={false}
          width={60}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '14px',
          }}
          formatter={(value: any) => [`${value}%`, 'Usage']}
          cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
        />
        <Bar 
          dataKey="usage" 
          radius={[0, 8, 8, 0]}
          barSize={12}
        >
          {deviceData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill="#3b82f6" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
