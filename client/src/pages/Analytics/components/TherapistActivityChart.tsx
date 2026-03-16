import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

interface TherapistActivityChartProps {
  hasData: boolean;
}

const therapistData = [
  { therapist: 'Therapist 1', sessions: 124 },
  { therapist: 'Therapist 2', sessions: 98 },
  { therapist: 'Therapist 3', sessions: 87 },
  { therapist: 'Therapist 4', sessions: 56 },
];

export function TherapistActivityChart({ hasData }: TherapistActivityChartProps) {
  if (!hasData) {
    return (
      <div className="h-[200px] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
          <Activity className="h-6 w-6 text-blue-500" />
        </div>
        <p className="text-sm text-muted-foreground">No data yet</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={therapistData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="therapist" 
          tick={{ fontSize: 12 }}
          stroke="#888888"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          stroke="#888888"
        />
        <Tooltip />
        <Bar dataKey="sessions" fill="#A855F7" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
