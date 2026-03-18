import { EmptyState } from '@/components/EmptyState';
import BluetoothIcon from '@/assets/bluetooth.svg';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useDeviceUsage } from '@/hooks/useAnalytics';
import { Skeleton } from '@/components/ui/skeleton';

interface DeviceUsageChartProps {
  hasData: boolean;
}

// Custom tick component to handle long device names
const CustomYAxisTick = (props: any) => {
  const { x, y, payload } = props;
  const maxLength = 12; // Maximum characters to show
  const text = payload.value;
  const displayText = text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  
  return (
    <g transform={`translate(${x},${y})`}>
      <title>{text}</title>
      <text
        x={0}
        y={0}
        dy={4}
        textAnchor="end"
        fill="#1f2937"
        fontSize={13}
      >
        {displayText}
      </text>
    </g>
  );
};

export function DeviceUsageChart({ hasData }: DeviceUsageChartProps) {
  // Fetch device usage data - will add limit filter later
  const { data: deviceUsageData, isLoading } = useDeviceUsage({ limit: 5 });
  
  // Transform API data to chart format
  const chartData = deviceUsageData?.devices.map(device => ({
    name: device.deviceName,
    usage: device.usagePercentage
  })) || [];
  
  if (isLoading) {
    return (
      <div className="h-[250px] space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 flex-1" />
          </div>
        ))}
      </div>
    );
  }
  
  if (!hasData || chartData.length === 0) {
    return <EmptyState icon={BluetoothIcon} message="No devices added yet" />;
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart 
        data={chartData} 
        layout="vertical"
        margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
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
          tick={<CustomYAxisTick />}
          axisLine={false}
          tickLine={false}
          width={100}
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
          {chartData.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill="#3b82f6" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
