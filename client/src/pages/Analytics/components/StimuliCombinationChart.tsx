import { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { useStimuliBreakdown, type AnalyticsFilters } from '@/hooks/useAnalytics';
import { Skeleton } from '@/components/ui/skeleton';

interface StimuliCombinationChartProps {
  hasData: boolean;
  filters?: AnalyticsFilters;
}

export const StimuliCombinationChart = memo(function StimuliCombinationChart({ hasData, filters }: StimuliCombinationChartProps) {
  // Fetch real data from API
  const { data: stimuliData, isLoading } = useStimuliBreakdown(filters);

  // Transform API data for bar chart
  const chartData = stimuliData ? [
    { name: 'Visual', value: stimuliData.visual, color: '#2563eb' },
    { name: 'Audio', value: stimuliData.audio, color: '#8b5cf6' },
    { name: 'Vibration', value: stimuliData.vibration, color: '#22c55e' },
  ] : [];

  if (isLoading) {
    return (
      <div className="h-[280px] space-y-3">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (!hasData || chartData.length === 0) {
    return (
      <div className="h-[280px] flex items-center justify-center">
        <p className="text-sm text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart 
        data={chartData} 
        layout="vertical"
        margin={{ top: 5, right: 50, left: 0, bottom: 5 }}
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
          width={100}
        />
        <Bar 
          dataKey="value" 
          radius={[0, 4, 4, 0]}
          barSize={20}
          label={{
            position: 'right',
            fill: '#1f2937',
            fontSize: 14,
            fontWeight: 500,
            content: (props: any) => {
              const { x, y, width, value } = props;
              return (
                <text
                  x={x + width + 10}
                  y={y}
                  dy={5}
                  fill="#1f2937"
                  fontSize={14}
                  fontWeight={500}
                >
                  {value}%
                </text>
              );
            }
          }}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
});
