import { Activity, Clock, Smartphone } from 'lucide-react';
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
              <div className="p-2 bg-blue-50 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-sm text-muted-foreground">Total Sessions</p>
            </div>
            <p className="text-3xl font-bold">{totalSessions}</p>
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
            <p className="text-3xl font-bold">{avgSessionDurationFormatted}</p>
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
            <p className="text-3xl font-bold">{phonesConnected}</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
