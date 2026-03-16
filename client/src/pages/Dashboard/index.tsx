import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/StatCard';
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
import SessionsIcon from '@/assets/sessions.svg';
import BluetoothIcon from '@/assets/bluetooth.svg';
import AverageSessionIcon from '@/assets/average-session.svg';

export function Dashboard() {
  const navigate = useNavigate();
  // Toggle this to see empty vs filled state
  const hasData = true;

  return (
    <div className="h-full">
      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            You've completed 3 sessions today, keep it up!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={SessionsIcon}
            label="Sessions Today"
            value={hasData ? "124" : "—"}
            iconBgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatCard
            icon={BluetoothIcon}
            label="Active Devices"
            value={hasData ? "18" : "—"}
            iconBgColor="bg-green-50"
            iconColor="text-green-600"
          />
          <StatCard
            icon={Users}
            label="Patients"
            value={hasData ? "4" : "—"}
            iconBgColor="bg-purple-50"
            iconColor="text-purple-600"
          />
          <StatCard
            icon={AverageSessionIcon}
            label="Avg Session Duration"
            value={hasData ? "9m 20s" : "—"}
            iconBgColor="bg-cyan-50"
            iconColor="text-cyan-600"
          />
        </div>

        {/* Session Over Time Chart - Full Width */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-semibold">Session Over Time</CardTitle>
            <Select defaultValue="october">
              <SelectTrigger className="w-[130px] h-9">
                <SelectValue placeholder="Select month" />
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

        {/* Device Usage & Stimuli Usage - Side by Side Below */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Device Usage - Horizontal Bars */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-base font-semibold">Device Usage</CardTitle>
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
              <DeviceUsageChart hasData={hasData} />
            </CardContent>
          </Card>

          {/* Stimuli Usage Breakdown - Donut Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-base font-semibold">Stimuli Usage Breakdown</CardTitle>
              <Select defaultValue="october">
                <SelectTrigger className="w-[130px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="october">October</SelectItem>
                  <SelectItem value="september">September</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <StimuliBreakdownChart hasData={hasData} />
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
