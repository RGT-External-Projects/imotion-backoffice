import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/EmptyState';
import { useNavigate } from 'react-router-dom';
import TimeIcon from '@/assets/time.svg';

interface RecentSessionsTableProps {
  hasData: boolean;
}

const sessionData = [
  { id: 'S1054', device: 'D - 118', phone: 'P-021', stimuli: ['Visual', 'Audio'], time: '02 Feb 2026 • 12:00 PM', duration: '8m' },
  { id: 'S1053', device: 'D - 103', phone: 'P-034', stimuli: ['Visual', 'Vibration'], time: '14 Feb 2026 • 10:30 AM', duration: '12m' },
  { id: 'S1052', device: 'D - 234', phone: 'P-012', stimuli: ['Audio', 'Vibration'], time: '05 Apr 2026 • 10:36 AM', duration: '14m' },
  { id: 'S1051', device: 'D - 129', phone: 'P-021', stimuli: ['Audio'], time: '13 Jan 2026 • 12:30 pM', duration: '10m' },
  { id: 'S1050', device: 'D - 213', phone: 'P-071', stimuli: ['Visual', 'Audio', 'Vibration'], time: '14 Feb 2026 • 10:30 AM', duration: '9m' },
];

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

  if (!hasData) {
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
          {sessionData.map((session) => (
            <tr key={session.id} className="border-b last:border-0">
              <td className="py-4 font-medium">{session.id}</td>
              <td className="py-4">{session.device}</td>
              <td className="py-4">{session.phone}</td>
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
              <td className="py-4 text-muted-foreground">{session.time}</td>
              <td className="py-4">{session.duration}</td>
              <td className="py-4">
                <button 
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
