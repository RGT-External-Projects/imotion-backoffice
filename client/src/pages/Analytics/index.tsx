import { useState } from 'react';
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
import SessionsIcon from '@/assets/sessions.svg';
import AverageSessionIcon from '@/assets/average-session.svg';
import BluetoothIcon from '@/assets/bluetooth.svg';

export function Analytics() {
  const hasData = true; // Toggle to false to show empty states
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dateRange, setDateRange] = useState('Custom date');

  const handleDateSelect = (formattedRange: string) => {
    setDateRange(formattedRange);
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
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Therapist" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Therapist</SelectItem>
              <SelectItem value="therapist1">Therapist 1</SelectItem>
              <SelectItem value="therapist2">Therapist 2</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Device" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Device</SelectItem>
              <SelectItem value="device1">Device 1</SelectItem>
              <SelectItem value="device2">Device 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={SessionsIcon}
          label="Total Sessions"
          value={hasData ? "365" : "—"}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          icon={AverageSessionIcon}
          label="Avg Session Duration"
          value={hasData ? "12m 30s" : "—"}
          iconBgColor="bg-cyan-50"
          iconColor="text-cyan-600"
        />
        <StatCard
          icon={BluetoothIcon}
          label="Active Devices"
          value={hasData ? "24" : "—"}
          iconBgColor="bg-green-50"
          iconColor="text-green-600"
        />
      </div>

      {/* Sessions Over Time Chart - REUSED */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base font-semibold">Sessions Over Time</CardTitle>
          <Select defaultValue="october">
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="october">October</SelectItem>
              <SelectItem value="september">September</SelectItem>
              <SelectItem value="august">August</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="pb-8">
          <SessionOverTimeChart hasData={hasData} />
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
            <StimuliCombinationChart hasData={hasData} />
          </CardContent>
        </Card>

        {/* Device Usage Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-semibold">Device Usage Sessions</CardTitle>
            <Select defaultValue="top5">
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top5">Top 5 Devices</SelectItem>
                <SelectItem value="top10">Top 10 Devices</SelectItem>
                <SelectItem value="all">All Devices</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <DeviceUsageSessionsChart hasData={hasData} />
          </CardContent>
        </Card>

        {/* Session Duration Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Session Duration Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <SessionDurationChart hasData={hasData} />
          </CardContent>
        </Card>

        {/* Phone Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Phone Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <PhoneSessionsChart hasData={hasData} />
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
