import { memo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { Smartphone } from 'lucide-react';
import { useTherapistActivity, type AnalyticsFilters } from '@/hooks/useAnalytics';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PhoneSessionsChartProps {
  hasData: boolean;
  filters?: AnalyticsFilters;
}

export const PhoneSessionsChart = memo(function PhoneSessionsChart({ hasData, filters }: PhoneSessionsChartProps) {
  const [phoneLimitOption, setPhoneLimitOption] = useState<string>('5');
  const { data: therapistData, isLoading } = useTherapistActivity(filters);
  
  // Determine how many phones to show
  const phoneLimit = phoneLimitOption === 'all' 
    ? therapistData?.therapists?.length || 999 
    : parseInt(phoneLimitOption);
  
  const phoneSessionData = therapistData?.therapists?.slice(0, phoneLimit).map((therapist: any) => {
    const fullName = therapist.displayName || therapist.phoneNumber || 'Unknown';
    // Truncate long names to 18 characters
    const displayName = fullName.length > 18 ? fullName.substring(0, 18) + '...' : fullName;
    return {
      phone: displayName,
      fullName: fullName,  // Keep full name for tooltip
      sessions: therapist.sessionCount,
    };
  }) || [];

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
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
          <Smartphone className="h-6 w-6 text-blue-500" />
        </div>
        <p className="text-sm text-muted-foreground">No data available</p>
      </div>
    );
  }

  const maxSessions = Math.max(...phoneSessionData.map((d: any) => d.sessions), 1);
  // Better domain calculation: add 20% padding or minimum of 10
  const xAxisMax = Math.max(maxSessions + Math.ceil(maxSessions * 0.2), 10);

  // Dynamic height based on number of phones: base 150px + 35px per phone
  const chartHeight = Math.max(280, 150 + (phoneSessionData.length * 35));

  return (
    <div>
      {/* Filter Dropdown */}
      <div className="mb-3 flex justify-end">
        <Select 
          value={phoneLimitOption} 
          onValueChange={(value) => value && setPhoneLimitOption(value)}
        >
          <SelectTrigger className="w-[150px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">Top 5 Phones</SelectItem>
            <SelectItem value="10">Top 10 Phones</SelectItem>
            <SelectItem value="all">All Phones</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart 
        data={phoneSessionData} 
        layout="vertical"
        margin={{ top: 5, right: 60, left: 0, bottom: 5 }}
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
          dataKey="phone"
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
          {phoneSessionData.map((_entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill="#3b82f6" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
    </div>
  );
});
