import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/StatCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SessionOverTimeChart } from '@/pages/Dashboard/components/SessionOverTimeChart';
import { StimuliCombinationChart } from './components/StimuliCombinationChart';
import { DeviceUsageSessionsChart } from './components/DeviceUsageSessionsChart';
import { SessionDurationChart } from './components/SessionDurationChart';
import { PhoneSessionsChart } from './components/PhoneSessionsChart';
import { DateRangePicker } from '@/components/DateRangePicker';
import { useTherapists } from '@/hooks/useTherapists';
import { useDevices } from '@/hooks/useDevices';
import { useAnalyticsStats } from '@/hooks/useAnalytics';
import { type AnalyticsFilters } from '@/backend/analytics.service';
import SessionsIcon from '@/assets/sessions.svg';
import AverageSessionIcon from '@/assets/average-session.svg';
import BluetoothIcon from '@/assets/bluetooth.svg';

export function Analytics() {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dateRange, setDateRange] = useState('Custom date');
  
  // Filter state
  const [filters, setFilters] = useState<AnalyticsFilters>({});
  
  // Sessions Over Time filter state
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());
  
  // Selected labels for display
  const [selectedTherapist, setSelectedTherapist] = useState<string>('all');
  const [selectedDevice, setSelectedDevice] = useState<string>('all');

  // Fetch dropdown data
  const { data: therapistsData } = useTherapists();
  const { data: devicesData } = useDevices();
  
  // Fetch analytics stats with filters
  const { data: stats, isLoading: statsLoading } = useAnalyticsStats(filters);

  const therapists = therapistsData || [];
  const devices = devicesData?.data || [];
  const hasData = !!stats && !statsLoading;
  
  // Debug logs
  console.log('Analytics Filters:', filters);
  console.log('Analytics Stats:', stats);
  console.log('Therapists Data:', therapistsData);

  // Handle date range selection
  const handleDateSelect = (formattedRange: string, startDate?: Date, endDate?: Date) => {
    setDateRange(formattedRange);
    setFilters(prev => ({
      ...prev,
      startDate: startDate?.toISOString().split('T')[0],
      endDate: endDate?.toISOString().split('T')[0],
    }));
  };

  // Handle therapist filter
  const handleTherapistChange = (value: string | null) => {
    if (!value) return;
    setSelectedTherapist(value);
    if (value === 'all') {
      setFilters(prev => {
        const { therapistPhoneId, ...rest } = prev;
        return rest;
      });
    } else {
      setFilters(prev => ({
        ...prev,
        therapistPhoneId: value,
      }));
    }
  };

  // Handle device filter
  const handleDeviceChange = (value: string | null) => {
    if (!value) return;
    setSelectedDevice(value);
    if (value === 'all') {
      setFilters(prev => {
        const { deviceId, ...rest } = prev;
        return rest;
      });
    } else {
      setFilters(prev => ({
        ...prev,
        deviceId: value,
      }));
    }
  };

  // Get display labels
  const selectedTherapistLabel = selectedTherapist === 'all' 
    ? 'All Therapists' 
    : therapists.find((t: any) => t.id === selectedTherapist)?.displayName || 
      therapists.find((t: any) => t.id === selectedTherapist)?.phoneNumber || 
      'Select therapist';

  const selectedDeviceLabel = selectedDevice === 'all'
    ? 'All Devices'
    : devices.find((d: any) => d.id === selectedDevice)?.deviceName ||
      devices.find((d: any) => d.id === selectedDevice)?.deviceId ||
      'Select device';

  // Generate all years from 1900 to current year + 5 (descending order for easy access to recent years)
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

  // Get selected month label for display
  const selectedMonthLabel = months.find(m => m.value === selectedMonth)?.label || '';

  // Calculate start and end dates for selected year/month
  const getMonthDateRange = (year: string, month: string) => {
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    
    // First day of month
    const startDate = new Date(yearNum, monthNum - 1, 1);
    // Last day of month
    const endDate = new Date(yearNum, monthNum, 0);
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  };

  // Create filters for Sessions Over Time chart
  const sessionsOverTimeFilters = {
    ...filters,
    ...getMonthDateRange(selectedYear, selectedMonth),
  };

  return (
    <div className="h-full p-6 space-y-6">
      {/* Filters Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsDatePickerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer bg-white"
          >
            <Calendar className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium">{dateRange}</span>
          </button>
          
          {/* Therapist Filter */}
          <Select value={selectedTherapist} onValueChange={handleTherapistChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue>{selectedTherapistLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Therapists</SelectItem>
              {therapists.map((therapist: any) => (
                <SelectItem key={therapist.id} value={therapist.id}>
                  {therapist.displayName || therapist.phoneNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Device Filter */}
          <Select value={selectedDevice} onValueChange={handleDeviceChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue>{selectedDeviceLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Devices</SelectItem>
              {devices.map((device: any) => (
                <SelectItem key={device.id} value={device.id}>
                  {device.deviceName || device.deviceId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={SessionsIcon}
          label="Total Sessions"
          value={hasData ? stats.totalSessions.toString() : "—"}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          icon={AverageSessionIcon}
          label="Avg Session Duration"
          value={hasData ? stats.avgSessionDuration : "—"}
          iconBgColor="bg-cyan-50"
          iconColor="text-cyan-600"
        />
        <StatCard
          icon={BluetoothIcon}
          label="Active Devices"
          value={hasData ? stats.activeDevices.toString() : "—"}
          iconBgColor="bg-green-50"
          iconColor="text-green-600"
        />
      </div>

      {/* Sessions Over Time Chart - REUSED */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base font-semibold">Sessions Over Time</CardTitle>
          <div className="flex items-center gap-2">
            {/* Year Selector - Scrollable with all years from 1900 to 2031 */}
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
            
            {/* Month Selector - Shows month name */}
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
          <SessionOverTimeChart hasData={hasData} filters={sessionsOverTimeFilters} />
        </CardContent>
      </Card>

      {/* Bottom Grid - 4 Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Stimuli Combination */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Stimuli Combination</CardTitle>
          </CardHeader>
          <CardContent>
            <StimuliCombinationChart hasData={hasData} filters={filters} />
          </CardContent>
        </Card>

        {/* Device Usage Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Device Usage Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <DeviceUsageSessionsChart hasData={hasData} filters={filters} />
          </CardContent>
        </Card>

        {/* Session Duration Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Session Duration Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <SessionDurationChart hasData={hasData} filters={filters} />
          </CardContent>
        </Card>

        {/* Phone Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Phone Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <PhoneSessionsChart hasData={hasData} filters={filters} />
          </CardContent>
        </Card>
      </div>

      {/* Date Range Picker Modal */}
      <DateRangePicker
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onSelect={handleDateSelect}
        currentRange={dateRange}
      />
    </div>
  );
}
