import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock } from 'lucide-react';

interface SessionDurationChartProps {
  hasData: boolean;
}

const durationData = [
  { duration: '0 - 5m', count: 52, percentage: 52 },
  { duration: '5 - 10m', count: 54, percentage: 54 },
  { duration: '10 - 15m', count: 85, percentage: 85 },
  { duration: '15 - 25m', count: 53, percentage: 53 },
  { duration: '25m+', count: 88, percentage: 88 },
];

export function SessionDurationChart({ hasData }: SessionDurationChartProps) {
  if (!hasData) {
    return (
      <div className="h-[280px] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
          <Clock className="h-6 w-6 text-blue-500" />
        </div>
        <p className="text-sm text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart 
        data={durationData}
        margin={{ top: 5, right: 20, left: 0, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis 
          dataKey="duration" 
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: '#9ca3af' }}
          axisLine={false}
          tickLine={false}
          domain={[0, 100]}
          ticks={[0, 25, 50, 75, 100]}
          tickFormatter={(value) => `${value}%`}
        />
        <Bar 
          dataKey="percentage" 
          fill="#10b981" 
          radius={[4, 4, 0, 0]} 
          barSize={60}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
