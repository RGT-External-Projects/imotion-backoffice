import { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import BluetoothIcon from '@/assets/bluetooth.svg';
import { useSessionDurationDistribution, type AnalyticsFilters } from '@/hooks/useAnalytics';
import { Skeleton } from '@/components/ui/skeleton';

interface SessionDurationChartProps {
  hasData: boolean;
  filters?: AnalyticsFilters;
}

export const SessionDurationChart = memo(function SessionDurationChart({ hasData, filters }: SessionDurationChartProps) {
  const { data: durationData, isLoading } = useSessionDurationDistribution(filters);

  const chartData = durationData?.buckets?.map((item: any) => ({
    duration: item.range,
    count: item.count,
  })) || [];

  if (isLoading) {
    return (
      <div className="h-[280px] space-y-3">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="h-[280px] flex flex-col items-center justify-center">
        <img src={BluetoothIcon} alt="" className="h-12 w-12 text-blue-400 mb-3" />
        <p className="text-sm text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart 
        data={chartData}
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
        />
        <Bar 
          dataKey="count" 
          fill="#10b981" 
          radius={[4, 4, 0, 0]} 
          barSize={60}
        />
      </BarChart>
    </ResponsiveContainer>
  );
});
