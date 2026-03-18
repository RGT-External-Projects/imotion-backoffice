import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SessionOverTimeChartProps {
  hasData: boolean;
}

const data = [
  { date: 'Oct 1', sessions: 20 },
  { date: 'Oct 2', sessions: 80 },
  { date: 'Oct 3', sessions: 100 },
  { date: 'Oct 4', sessions: 65 },
  { date: 'Oct 5', sessions: 150 },
  { date: 'Oct 6', sessions: 95 },
  { date: 'Oct 7', sessions: 115 },
  { date: 'Oct 8', sessions: 110 },
  { date: 'Oct 9', sessions: 65 },
  { date: 'Oct 10', sessions: 140 },
  { date: 'Oct 11', sessions: 135 },
  { date: 'Oct 12', sessions: 130 },
  { date: 'Oct 13', sessions: 115 },
  { date: 'Oct 14', sessions: 110 },
  { date: 'Oct 15', sessions: 120 },
];

export function SessionOverTimeChart({ hasData }: SessionOverTimeChartProps) {
  if (!hasData) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground text-sm">No data showing</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={{ stroke: '#e5e7eb' }}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={{ stroke: '#e5e7eb' }}
          domain={[0, 200]}
          ticks={[0, 80, 120, 140, 200]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#3b82f6',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            padding: '8px 12px',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
          labelStyle={{ display: 'none' }}
          formatter={(value: any) => [value, '']}
        />
        <Area 
          type="monotone" 
          dataKey="sessions" 
          stroke="#3b82f6" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorSessions)" 
          dot={{ fill: '#3b82f6', r: 4 }}
          activeDot={{ r: 6, fill: '#3b82f6' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
