import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, Clock, Smartphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type TabType = 'overview' | 'timeline';

const sessionHistory = [
  { id: 'S1054', phoneId: 'P-021', patientCode: 'P-021', timestamp: '12 Jan 2026 • 09:15 AM', duration: '8m' },
  { id: 'S1053', phoneId: 'P-034', patientCode: 'P-034', timestamp: '02 Feb 2026 • 14:45 PM', duration: '12m' },
  { id: 'S1054', phoneId: 'P-134', patientCode: 'P-134', timestamp: '23 Dec 2025 • 10:30 AM', duration: '12m' },
  { id: 'S1051', phoneId: 'P-345', patientCode: 'P-345', timestamp: '02 Feb 2026 • 12:00 PM', duration: '10m' },
  { id: 'S1050', phoneId: 'P-678', patientCode: 'P-678', timestamp: '14 Feb 2026 • 10:30 AM', duration: '9m' },
];

const phoneConnectionHistory = [
  { phoneId: 'P-021', sessionsRun: 120, lastConnected: '12 Jan 2026 • 09:15 AM' },
  { phoneId: 'P-345', sessionsRun: 70, lastConnected: '02 Feb 2026 • 12:00 PM' },
  { phoneId: 'P-678', sessionsRun: 22, lastConnected: '14 Feb 2026 • 10:30 AM' },
];

const timelineEvents = [
  {
    timestamp: 'February 26, 2026 - 09:11 AM',
    title: 'Session Started',
    description: 'Phone-02 initiated Session S1054 on device D-118 for patient P-233'
  },
  {
    timestamp: 'February 26, 2026 09:15 AM',
    title: 'Stimuli Configuration adjusted',
    description: 'Visual stimulus speed adjusted from Level 10 to Level 13 during Session S1054.'
  },
  {
    timestamp: 'February 26, 2026 09:23 AM',
    title: 'Session Paused',
    description: 'Session S1054 was paused by Phone-02 during the active test session.'
  },
  {
    timestamp: 'February 26, 2026 09:23 AM',
    title: 'Session Resumed',
    description: 'Session S1054 resumed after pause by Phone-02.'
  },
  {
    timestamp: 'February 26, 2026 09:45 AM',
    title: 'Session Completed',
    description: 'Session S1054 ended successfully with a duration of 8 minutes'
  },
  {
    timestamp: 'February 26, 2026 09:45 AM',
    title: 'Device Connected',
    description: 'Device D-118 connected to Phone-01 via Bluetooth.'
  },
];

export function DeviceDetails() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

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
          <h1 className="text-3xl font-bold mb-2">D - 118</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Firmware version: v1.2.4</span>
            <span>•</span>
            <span>Firmware version: 26 Feb 2026</span>
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
                <p className="text-3xl font-bold">124</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-cyan-50 rounded-lg">
                    <Clock className="h-5 w-5 text-cyan-600" />
                  </div>
                  <p className="text-sm text-muted-foreground">Avg Session Dura...</p>
                </div>
                <p className="text-3xl font-bold">9m 20s</p>
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
                <p className="text-3xl font-bold">4</p>
              </CardContent>
            </Card>
          </div>

          {/* Session History */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Session History</CardTitle>
            </CardHeader>
            <CardContent>
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
                    {sessionHistory.map((session, index) => (
                      <tr key={index} className="border-b border-gray-200 last:border-0">
                        <td className="py-3">{session.id}</td>
                        <td className="py-3">{session.phoneId}</td>
                        <td className="py-3">{session.patientCode}</td>
                        <td className="py-3 text-muted-foreground">{session.timestamp}</td>
                        <td className="py-3">{session.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Phone Connection History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Phone Connection History</CardTitle>
            </CardHeader>
            <CardContent>
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
                    {phoneConnectionHistory.map((phone, index) => (
                      <tr key={index} className="border-b border-gray-200 last:border-0">
                        <td className="py-3">{phone.phoneId}</td>
                        <td className="py-3">{phone.sessionsRun}</td>
                        <td className="py-3 text-muted-foreground">{phone.lastConnected}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                        <p className="text-xl font-semibold text-gray-900">D - 118</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Activity className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-2">Firmware</p>
                        <p className="text-xl font-semibold text-gray-900">v1.2.4</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-2">Last used</p>
                        <p className="text-xl font-semibold text-gray-900">26 Feb 2026</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-semibold mb-6 text-lg">Timeline</h3>
                <div className="space-y-8">
                  {timelineEvents.map((event, index) => (
                    <div key={index} className="relative flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full border-2 border-blue-500 bg-white flex-shrink-0" />
                        {index < timelineEvents.length - 1 && (
                          <div className="w-0.5 flex-1 bg-gray-200 mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <p className="text-sm text-gray-500 mb-2">{event.timestamp}</p>
                        <h4 className="font-semibold text-gray-900 mb-3">{event.title}</h4>
                        <div className="bg-gray-100 rounded-lg p-4">
                          <p className="text-sm text-gray-900 leading-relaxed">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
