import { useState, useMemo } from 'react';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/StatCard';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SessionOverTimeChart } from './components/SessionOverTimeChart';
import { DeviceUsageChart } from './components/DeviceUsageChart';
import { StimuliBreakdownChart } from './components/StimuliBreakdownChart';
import { RecentSessionsTable } from './components/RecentSessionsTable';
import { useDashboardStats } from '@/hooks/useAnalytics';
import SessionsIcon from '@/assets/sessions.svg';
import BluetoothIcon from '@/assets/bluetooth.svg';
import AverageSessionIcon from '@/assets/average-session.svg';

export function Dashboard() {
  const navigate = useNavigate();
  
  // Sessions Over Time filter state
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());
  
  // Stimuli Breakdown filter state
  const [stimuliYear, setStimuliYear] = useState<string>(new Date().getFullYear().toString());
  const [stimuliMonth, setStimuliMonth] = useState<string>((new Date().getMonth() + 1).toString());

  // Device Usage filter state
  const [deviceLimitOption, setDeviceLimitOption] = useState<string>('5');
  const deviceLimit = deviceLimitOption === 'all' ? 999 : parseInt(deviceLimitOption);
  
  // Fetch dashboard stats from API
  const { data: stats, isLoading, isError } = useDashboardStats();
  
  // Determine if we have data (not loading and no error)
  const hasData = !isLoading && !isError && !!stats;

  console.log("dashboard stats", stats)

  // Generate all years from 1900 to current year + 5
  const currentYear = new Date().getFullYear();
  const startYear = 1900;
  const endYear = currentYear + 5;
  const totalYears = endYear - startYear + 1;
  const years = Array.from({ length: totalYears }, (_, i) => endYear - i);

  // Month options with labels
  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  // Get selected month label
  const selectedMonthLabel = months.find(m => m.value === selectedMonth)?.label || '';

  // Calculate start and end dates for selected year/month
  const getMonthDateRange = (year: string, month: string) => {
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    
    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 0);
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  };

  // Create filters for Sessions Over Time chart
  const sessionsOverTimeFilters = useMemo(
    () => getMonthDateRange(selectedYear, selectedMonth),
    [selectedYear, selectedMonth]
  );

  // Create filters for Stimuli Breakdown chart
  const stimuliFilters = useMemo(
    () => getMonthDateRange(stimuliYear, stimuliMonth),
    [stimuliYear, stimuliMonth]
  );

  return (
    <div className="h-full">
      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            {hasData ? `You've completed ${stats.sessionsToday} session${stats.sessionsToday !== 1 ? 's' : ''} today, keep it up!` : 'Loading...'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                    <Skeleton className="h-9 w-20" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <>
              <StatCard
                icon={SessionsIcon}
                label="Sessions Today"
                value={hasData ? stats.sessionsToday.toString() : "—"}
                iconBgColor="bg-blue-50"
                iconColor="text-blue-600"
              />
              <StatCard
                icon={BluetoothIcon}
                label="Active Devices"
                value={hasData ? stats.activeDevices.toString() : "—"}
                iconBgColor="bg-green-50"
                iconColor="text-green-600"
              />
              <StatCard
                icon={Users}
                label="Patients"
                value={hasData ? stats.totalPatients.toString() : "—"}
                iconBgColor="bg-purple-50"
                iconColor="text-purple-600"
              />
              <StatCard
                icon={AverageSessionIcon}
                label="Avg Session Duration"
                value={hasData ? stats.avgSessionDuration : "—"}
                iconBgColor="bg-cyan-50"
                iconColor="text-cyan-600"
              />
            </>
          )}
        </div>

        {/* Session Over Time Chart - Full Width */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-semibold">Session Over Time</CardTitle>
            <div className="flex items-center gap-2">
              {/* Year Selector */}
              <Select value={selectedYear} onValueChange={(value) => value && setSelectedYear(value)}>
                <SelectTrigger className="w-[100px] h-9">
                  <SelectValue>{selectedYear}</SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Month Selector */}
              <Select value={selectedMonth} onValueChange={(value) => value && setSelectedMonth(value)}>
                <SelectTrigger className="w-[120px] h-9">
                  <SelectValue>{selectedMonthLabel}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="pb-8">
            <SessionOverTimeChart hasData={true} filters={sessionsOverTimeFilters} />
          </CardContent>
        </Card>

        {/* Device Usage & Stimuli Usage - Side by Side Below */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Device Usage - Horizontal Bars */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-base font-semibold">Device Usage</CardTitle>
              <Select 
                value={deviceLimitOption} 
                onValueChange={(value) => value && setDeviceLimitOption(value)}
              >
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="Select limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">Top 5 Devices</SelectItem>
                  <SelectItem value="10">Top 10 Devices</SelectItem>
                  <SelectItem value="all">All Devices</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <DeviceUsageChart hasData={hasData} limit={deviceLimit} />
            </CardContent>
          </Card>

          {/* Stimuli Usage Breakdown - Donut Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-base font-semibold">Stimuli Usage Breakdown</CardTitle>
              <div className="flex items-center gap-2">
                {/* Year Selector */}
                <Select value={stimuliYear} onValueChange={(value) => value && setStimuliYear(value)}>
                  <SelectTrigger className="w-[100px] h-9">
                    <SelectValue>{stimuliYear}</SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto">
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Month Selector */}
                <Select value={stimuliMonth} onValueChange={(value) => value && setStimuliMonth(value)}>
                  <SelectTrigger className="w-[120px] h-9">
                    <SelectValue>{months.find(m => m.value === stimuliMonth)?.label || ''}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <StimuliBreakdownChart hasData={true} filters={stimuliFilters} />
            </CardContent>
          </Card>
        </div>

        {/* Recent Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-semibold">Recent Sessions</CardTitle>
            <button 
              onClick={() => navigate('/sessions')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
            >
              View all →
            </button>
          </CardHeader>
          <CardContent>
            <RecentSessionsTable hasData={hasData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
