import { Smartphone } from 'lucide-react';
import SessionsIcon from '@/assets/sessions.svg';
import AnalyticsIcon from '@/assets/analytics.svg';
import { Card, CardContent } from '@/components/ui/card';

interface DeviceUsageStatisticsProps {
  totalSessions: number;
  avgSessionDurationFormatted: string;
  phonesConnected: number;
}

export function DeviceUsageStatistics({
  totalSessions,
  avgSessionDurationFormatted,
  phonesConnected,
}: DeviceUsageStatisticsProps) {
  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Usage Statistics</h2>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-100">
                <img
                  src={SessionsIcon}
                  alt="Total sessions icon"
                  className="h-5 w-5"
                />
              </div>
              <p className="text-sm text-muted-foreground">Total Sessions</p>
            </div>
            <p className="text-3xl font-bold">{totalSessions}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-cyan-100">
                <img
                  src={AnalyticsIcon}
                  alt="Average session duration icon"
                  className="h-5 w-5"
                />
              </div>
              <p className="text-sm text-muted-foreground">Avg Session Duration</p>
            </div>
            <p className="text-3xl font-bold">{avgSessionDurationFormatted}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-green-100">
                <Smartphone className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground">Phones Connected</p>
            </div>
            <p className="text-3xl font-bold">{phonesConnected}</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
