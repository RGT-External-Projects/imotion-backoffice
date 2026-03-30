import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useDeviceDetails } from '@/hooks/useDevices';
import { format } from 'date-fns';
import { DeviceUsageStatistics } from './components/DeviceUsageStatistics';
import { DeviceSessionHistory } from './components/DeviceSessionHistory';
import { DevicePhoneHistory } from './components/DevicePhoneHistory';
import { DeviceOverviewTab } from './components/DeviceOverviewTab';
import { DeviceTimelineTab } from './components/DeviceTimelineTab';

type TabType = 'overview' | 'activity';

export function DeviceDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  const { data: device, isLoading, error } = useDeviceDetails(id);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-gray-200 bg-white">
          <Skeleton className="h-10 w-40 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex-1 p-6">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !device) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">Failed to load device details</p>
        <button
          onClick={() => navigate('/devices')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Devices
        </button>
      </div>
    );
  }

  const lastUsedDate = device.lastConnected 
    ? format(new Date(device.lastConnected), 'dd MMM yyyy')
    : 'Never';

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div>
          <h1 className="text-3xl font-bold mb-2">{device.deviceId}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Firmware version: {device.firmwareVersion || 'N/A'}</span>
            <span>•</span>
            <span>Last used: {lastUsedDate}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Usage Statistics */}
          <DeviceUsageStatistics
            totalSessions={device.statistics.totalSessions}
            avgSessionDurationFormatted={device.statistics.avgSessionDurationFormatted}
            phonesConnected={device.statistics.phonesConnected}
          />

          {/* Session History */}
          <DeviceSessionHistory sessions={device.sessions || []} />

          {/* Phone Connection History */}
          <DevicePhoneHistory therapistPhones={device.therapistPhones || []} />
        </div>

        {/* Right Side - Tabs */}
        <div className="w-96 border-l border-gray-200 bg-gray-50 flex flex-col">
          {/* Tabs */}
          <div className="flex gap-2 p-4 bg-white border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={cn(
                'flex-1 px-6 py-2.5 font-medium rounded-lg transition-colors',
                activeTab === 'overview'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={cn(
                'flex-1 px-6 py-2.5 font-medium rounded-lg transition-colors',
                activeTab === 'activity'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              Activity
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'overview' ? (
              <DeviceOverviewTab
                deviceId={device.deviceId}
                firmwareVersion={device.firmwareVersion}
                lastUsedDate={lastUsedDate}
              />
            ) : (
              <DeviceTimelineTab activityLogs={device.activityLogs || []} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
