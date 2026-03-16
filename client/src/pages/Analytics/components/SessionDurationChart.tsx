import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock } from 'lucide-react';

interface SessionDurationChartProps {
  hasData: boolean;
}

const durationData = [
  { duration: '0-5 min', count: 20 },
  { duration: '5-10 min', count: 45 },
  { duration: '10-15 min', count: 35 },
  { duration: '15-20 min', count: 15 },
  { duration: '20+ min', count: 10 },
];

export function SessionDurationChart({ hasData }: SessionDurationChartProps) {
  if (!hasData) {
    return (
      <div className="h-[200px] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
          <Clock className="h-6 w-6 text-blue-500" />
        </div>
        <p className="text-sm text-muted-foreground">No devices added yet</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={durationData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="duration" 
          tick={{ fontSize: 12 }}
          stroke="#888888"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          stroke="#888888"
        />
        <Tooltip />
        <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
