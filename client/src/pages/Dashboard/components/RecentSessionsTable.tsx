import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/EmptyState';
import { useNavigate } from 'react-router-dom';
import { useRecentSessions } from '@/hooks/useAnalytics';
import { Skeleton } from '@/components/ui/skeleton';
import TimeIcon from '@/assets/time.svg';

interface RecentSessionsTableProps {
  hasData: boolean;
}

const getStimuliColor = (stimuli: string) => {
  switch (stimuli) {
    case 'Visual':
      return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
    case 'Audio':
      return 'bg-purple-100 text-purple-700 hover:bg-purple-100';
    case 'Vibration':
      return 'bg-green-100 text-green-700 hover:bg-green-100';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export function RecentSessionsTable({ hasData }: RecentSessionsTableProps) {
  const navigate = useNavigate();
  
  // Fetch recent sessions data - will add limit filter later
  const { data: sessions, isLoading } = useRecentSessions({ limit: 5 });
  
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-12 w-20" />
            <Skeleton className="h-12 w-24" />
            <Skeleton className="h-12 w-24" />
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-16" />
            <Skeleton className="h-12 w-16" />
          </div>
        ))}
      </div>
    );
  }
  
  if (!hasData || !sessions || sessions.length === 0) {
    return <EmptyState icon={TimeIcon} message="No recent sessions" />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b text-left text-sm text-muted-foreground">
            <th className="pb-3 font-medium">Session ID</th>
            <th className="pb-3 font-medium">Device</th>
            <th className="pb-3 font-medium">Phone ID</th>
            <th className="pb-3 font-medium">Stimuli used</th>
            <th className="pb-3 font-medium">Session Timestamp</th>
            <th className="pb-3 font-medium">Duration</th>
            <th className="pb-3 font-medium"></th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {sessions.map((session) => (
            <tr key={session.id} className="border-b last:border-0">
              <td className="py-4 font-medium">{session.sessionId}</td>
              <td className="py-4">{session.deviceName}</td>
              <td className="py-4">{session.therapistName}</td>
              <td className="py-4">
                <div className="flex gap-1.5">
                  {session.stimuli.map((s) => (
                    <Badge
                      key={s}
                      variant="secondary"
                      className={getStimuliColor(s)}
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              </td>
              <td className="py-4 text-muted-foreground">
                {new Date(session.timestamp).toLocaleDateString('en-US', { 
                  day: '2-digit', 
                  month: 'short', 
                  year: 'numeric' 
                })} • {new Date(session.timestamp).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </td>
              <td className="py-4">{session.duration}</td>
              <td className="py-4">
                <button 
                  // Use the full UUID for routing; sessionId is just a short display code
                  onClick={() => navigate(`/sessions/${session.id}`)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  👁 view
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
