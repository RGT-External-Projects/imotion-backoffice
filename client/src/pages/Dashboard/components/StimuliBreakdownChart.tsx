import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useStimuliBreakdown } from '@/hooks/useAnalytics';
import { Skeleton } from '@/components/ui/skeleton';

interface StimuliBreakdownChartProps {
  hasData: boolean;
}

const emptyData = [
  { name: 'Visual', value: 100, color: '#e5e7eb' },
];

const renderLegend = (_props: any, chartData: any[], showValues: boolean) => {
  return (
    <div className="flex flex-col gap-3">
      {chartData.map((item: any, index: number) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm text-muted-foreground">
            {item.name} - {showValues ? item.value + '%' : '--'}
          </span>
        </div>
      ))}
    </div>
  );
};

export function StimuliBreakdownChart({ hasData }: StimuliBreakdownChartProps) {
  // Fetch stimuli breakdown data - will add month filter later
  const { data: stimuliData, isLoading } = useStimuliBreakdown();
  
  // Transform API data to chart format
  const stimuliChartData = stimuliData ? [
    { name: 'Visual', value: stimuliData.visual, color: '#3b82f6' },
    { name: 'Audio', value: stimuliData.audio, color: '#eab308' },
    { name: 'Vibration', value: stimuliData.vibration, color: '#22c55e' },
  ] : [];
  
  const emptyData = [{ name: 'Visual', value: 100, color: '#e5e7eb' }];
  const chartData = (hasData && !isLoading && stimuliChartData.length > 0) ? stimuliChartData : emptyData;

  if (isLoading) {
    return (
      <div className="h-[250px] flex items-center justify-center gap-8">
        <Skeleton className="h-40 w-40 rounded-full" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={chartData}
          cx="40%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={hasData ? 2 : 0}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Legend 
          verticalAlign="middle" 
          align="right"
          layout="vertical"
          content={(props) => renderLegend(props, chartData, hasData && !isLoading)}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
