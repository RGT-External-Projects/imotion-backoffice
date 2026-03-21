import { useState, memo } from 'react';
import { EmptyState } from '@/components/EmptyState';
import BluetoothIcon from '@/assets/bluetooth.svg';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { useDeviceUsage, type AnalyticsFilters } from '@/hooks/useAnalytics';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DeviceUsageSessionsChartProps {
  hasData: boolean;
  filters?: AnalyticsFilters;
}

export const DeviceUsageSessionsChart = memo(function DeviceUsageSessionsChart({ hasData, filters }: DeviceUsageSessionsChartProps) {
  // Move state HERE so changing it doesn't re-render parent
  const [limit, setLimit] = useState<number>(5);
  // Fetch real data from API
  const { data: deviceData, isLoading } = useDeviceUsage(filters);

  // Transform API data for chart - use limit prop
  const deviceSessionData = deviceData?.devices?.slice(0, limit).map((device: any) => {
    const fullName = device.deviceName || device.deviceId;
    // Truncate long names to 18 characters
    const displayName = fullName.length > 18 ? fullName.substring(0, 18) + '...' : fullName;
    return {
      name: displayName,
      fullName: fullName,  // Keep full name for tooltip
      sessions: device.sessionCount,
    };
  }) || [];

  if (isLoading) {
    return (
      <div className="h-[280px] space-y-3">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (!hasData || deviceSessionData.length === 0) {
    return <EmptyState icon={BluetoothIcon} message="No devices added yet" />;
  }

  const maxSessions = Math.max(...deviceSessionData.map((d: any) => d.sessions), 1);
  // Better domain calculation: add 20% padding or minimum of 10
  const xAxisMax = Math.max(maxSessions + Math.ceil(maxSessions * 0.2), 10);

  return (
    <div className="space-y-4">
      {/* Filter dropdown inside chart component */}
      <div className="flex justify-end mb-2">
        <Select 
          defaultValue="top5" 
          onValueChange={(value) => {
            if (value === 'top5') setLimit(5);
            else if (value === 'top10') setLimit(10);
            else setLimit(999); // Show all
          }}
        >
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="top5">Top 5 Devices</SelectItem>
            <SelectItem value="top10">Top 10 Devices</SelectItem>
            <SelectItem value="all">All Devices</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <ResponsiveContainer width="100%" height={280}>
        <BarChart 
          data={deviceSessionData} 
          layout="vertical"
          margin={{ top: 5, right: 80, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                    <p className="font-semibold text-sm text-gray-900">{payload[0].payload.fullName}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Sessions: <span className="font-semibold">{payload[0].value}</span>
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <XAxis 
            type="number" 
            domain={[0, xAxisMax]}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            label={{ 
              value: 'Number of Sessions', 
              position: 'bottom',
              offset: -10,
              style: { fontSize: 11, fill: '#6b7280' }
            }}
          />
          <YAxis 
            type="category" 
            dataKey="name"
            tick={{ fontSize: 12, fill: '#1f2937' }}
            axisLine={false}
            tickLine={false}
            width={140}
            interval={0}
          />
          <Bar 
            dataKey="sessions" 
            radius={[0, 4, 4, 0]}
            barSize={16}
            background={{ fill: '#f3f4f6' }}
            label={{ 
              position: 'right', 
              fill: '#1f2937', 
              fontSize: 14,
              fontWeight: 500
            }}
          >
            {deviceSessionData.map((_entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill="#8b5cf6" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});
