import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Activity, Clock, Smartphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useDeviceDetails } from '@/hooks/useDevices';
import { format } from 'date-fns';

type TabType = 'overview' | 'timeline';

// Helper to format duration from seconds to "Xm Ys"
const formatDuration = (seconds: number | null | undefined): string => {
  if (!seconds) return '0m 0s';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}m ${secs}s`;
};

// Helper to format timestamp
const formatTimestamp = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'dd MMM yyyy • hh:mm a');
  } catch {
    return dateString;
  }
};

// Helper to format timeline timestamp
const formatTimelineTimestamp = (dateString: string): string => {
  try {
    return format(new Date(dateString), 'MMMM dd, yyyy - hh:mm a');
  } catch {
    return dateString;
  }
};

// Map event types to readable titles
const getEventTitle = (eventType: string): string => {
  const titles: Record<string, string> = {
    'SESSION_STARTED': 'Session Started',
    'SESSION_COMPLETED': 'Session Completed',
    'DEVICE_CONNECTED': 'Device Connected',
    'DEVICE_DISCONNECTED': 'Device Disconnected',
    'FIRMWARE_UPDATED': 'Firmware Updated',
    'DEVICE_REGISTERED': 'Device Registered',
    'THERAPIST_PHONE_CONNECTED': 'Therapist Phone Connected',
    'THERAPIST_PHONE_DISCONNECTED': 'Therapist Phone Disconnected',
    'SETTINGS_CHANGED': 'Settings Changed',
  };
  return titles[eventType] || eventType;
};

export function DeviceDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [sessionPage, setSessionPage] = useState(1);
  const [phonePage, setPhonePage] = useState(1);
  const sessionsPerPage = 10;
  const phonesPerPage = 5;
  
  const { data: device, isLoading, error } = useDeviceDetails(id);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-gray-200 bg-white">
          <button
            onClick={() => navigate('/devices')}
            className="mb-4 flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Devices</span>
          </button>
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

  // Pagination calculations for sessions
  const totalSessions = device.sessions?.length || 0;
  const totalSessionPages = Math.ceil(totalSessions / sessionsPerPage);
  const sessionStartIndex = (sessionPage - 1) * sessionsPerPage;
  const sessionEndIndex = sessionStartIndex + sessionsPerPage;
  const paginatedSessions = device.sessions?.slice(sessionStartIndex, sessionEndIndex) || [];

  // Pagination calculations for phones
  const totalPhones = device.therapistPhones?.length || 0;
  const totalPhonePages = Math.ceil(totalPhones / phonesPerPage);
  const phoneStartIndex = (phonePage - 1) * phonesPerPage;
  const phoneEndIndex = phoneStartIndex + phonesPerPage;
  const paginatedPhones = device.therapistPhones?.slice(phoneStartIndex, phoneEndIndex) || [];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <button
          onClick={() => navigate('/devices')}
          className="mb-4 flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back to Devices</span>
        </button>

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
          <h2 className="text-lg font-semibold mb-4">Usage Statistics</h2>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Activity className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
                </div>
                <p className="text-3xl font-bold">{device.statistics.totalSessions}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-cyan-50 rounded-lg">
                    <Clock className="h-5 w-5 text-cyan-600" />
                  </div>
                  <p className="text-sm text-muted-foreground">Avg Session Duration</p>
                </div>
                <p className="text-3xl font-bold">{device.statistics.avgSessionDurationFormatted}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Smartphone className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-sm text-muted-foreground">Phones Connected</p>
                </div>
                <p className="text-3xl font-bold">{device.statistics.phonesConnected}</p>
              </CardContent>
            </Card>
          </div>

          {/* Session History */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Session History ({totalSessions})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {device.sessions && device.sessions.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 text-left text-sm text-muted-foreground">
                          <th className="pb-3 font-medium">Session ID</th>
                          <th className="pb-3 font-medium">Phone ID</th>
                          <th className="pb-3 font-medium">Patient Code</th>
                          <th className="pb-3 font-medium">Session Timestamp</th>
                          <th className="pb-3 font-medium">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {paginatedSessions.map((session) => (
                          <tr key={session.id} className="border-b border-gray-200 last:border-0">
                            <td className="py-3">{session.id.slice(0, 8)}...</td>
                            <td className="py-3">
                              {session.therapistPhone?.displayName || session.therapistPhone?.phoneNumber || 'N/A'}
                            </td>
                            <td className="py-3">{session.patient?.patientCode || 'N/A'}</td>
                            <td className="py-3 text-muted-foreground">
                              {formatTimestamp(session.sessionTimestamp)}
                            </td>
                            <td className="py-3">{formatDuration(session.duration)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {totalSessionPages > 1 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        Showing {sessionStartIndex + 1} to {Math.min(sessionEndIndex, totalSessions)} of {totalSessions}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSessionPage((prev) => Math.max(1, prev - 1))}
                          disabled={sessionPage === 1}
                          className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <span className="px-3 py-1 text-sm">
                          Page {sessionPage} of {totalSessionPages}
                        </span>
                        <button
                          onClick={() => setSessionPage((prev) => Math.min(totalSessionPages, prev + 1))}
                          disabled={sessionPage === totalSessionPages}
                          className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No sessions found for this device
                </p>
              )}
            </CardContent>
          </Card>

          {/* Phone Connection History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Phone Connection History ({totalPhones})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {device.therapistPhones && device.therapistPhones.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 text-left text-sm text-muted-foreground">
                          <th className="pb-3 font-medium">Phone ID</th>
                          <th className="pb-3 font-medium">Sessions run</th>
                          <th className="pb-3 font-medium">Last connected</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {paginatedPhones.map((phone) => (
                          <tr key={phone.id} className="border-b border-gray-200 last:border-0">
                            <td className="py-3">{phone.displayName || phone.phoneNumber}</td>
                            <td className="py-3">{phone.sessionsRun}</td>
                            <td className="py-3 text-muted-foreground">
                              {formatTimestamp(phone.lastConnected)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {totalPhonePages > 1 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        Showing {phoneStartIndex + 1} to {Math.min(phoneEndIndex, totalPhones)} of {totalPhones}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setPhonePage((prev) => Math.max(1, prev - 1))}
                          disabled={phonePage === 1}
                          className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <span className="px-3 py-1 text-sm">
                          Page {phonePage} of {totalPhonePages}
                        </span>
                        <button
                          onClick={() => setPhonePage((prev) => Math.min(totalPhonePages, prev + 1))}
                          disabled={phonePage === totalPhonePages}
                          className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No phone connections found for this device
                </p>
              )}
            </CardContent>
          </Card>
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
              onClick={() => setActiveTab('timeline')}
              className={cn(
                'flex-1 px-6 py-2.5 font-medium rounded-lg transition-colors',
                activeTab === 'timeline'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              Timeline
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'overview' ? (
              <>
                <h3 className="font-semibold mb-6 text-lg">Overview</h3>
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Smartphone className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-2">Device ID</p>
                        <p className="text-xl font-semibold text-gray-900">{device.deviceId}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Activity className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-2">Firmware</p>
                        <p className="text-xl font-semibold text-gray-900">
                          {device.firmwareVersion || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-2">Last used</p>
                        <p className="text-xl font-semibold text-gray-900">{lastUsedDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-semibold mb-6 text-lg">Timeline</h3>
                {device.activityLogs && device.activityLogs.length > 0 ? (
                  <div className="space-y-8">
                    {device.activityLogs.map((event, index) => (
                      <div key={event.id} className="relative flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full border-2 border-blue-500 bg-white flex-shrink-0" />
                          {index < device.activityLogs.length - 1 && (
                            <div className="w-0.5 flex-1 bg-gray-200 mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <p className="text-sm text-gray-500 mb-2">
                            {formatTimelineTimestamp(event.timestamp)}
                          </p>
                          <h4 className="font-semibold text-gray-900 mb-3">
                            {getEventTitle(event.eventType)}
                          </h4>
                          <div className="bg-gray-100 rounded-lg p-4">
                            <p className="text-sm text-gray-900 leading-relaxed">
                              {event.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No activity logs available
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
