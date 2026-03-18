import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSessionsOverTime } from '@/hooks/useAnalytics';
import { Skeleton } from '@/components/ui/skeleton';

interface SessionOverTimeChartProps {
  hasData: boolean;
}

export function SessionOverTimeChart({ hasData }: SessionOverTimeChartProps) {
  // Fetch sessions over time data - will add month filter later
  const { data: sessionsData, isLoading } = useSessionsOverTime();
  
  // Transform API data to chart format
  const chartData = sessionsData?.data.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    sessions: item.count
  })) || [];
  
  if (isLoading) {
    return (
      <div className="h-[300px] space-y-3">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }
  
  if (!hasData || chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground text-sm">No data showing</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            color: '#1f2937',
            padding: '8px 12px',
            fontSize: '14px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
          formatter={(value: any, name: any, props: any) => {
            return [`${value} sessions`, props.payload.date];
          }}
          labelFormatter={() => ''}
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
