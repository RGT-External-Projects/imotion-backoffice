import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Session {
  id: string;
  phoneId: string;
  device: string;
  stimuli: string[];
  timestamp: string;
  status: 'Completed' | 'Interrupted';
  duration: string;
}

interface SessionsTableProps {
  sessions: Session[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const getStimuliColor = (stimuli: string) => {
  switch (stimuli) {
    case 'Visual':
      return 'bg-orange-100 text-orange-700 hover:bg-orange-100';
    case 'Audio':
      return 'bg-purple-100 text-purple-700 hover:bg-purple-100';
    case 'Vibration':
      return 'bg-cyan-100 text-cyan-700 hover:bg-cyan-100';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export function SessionsTable({ sessions, currentPage, totalPages, onPageChange }: SessionsTableProps) {
  const navigate = useNavigate();

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-sm text-muted-foreground bg-gray-50">
              <th className="p-4 font-medium">Session ID</th>
              <th className="p-4 font-medium">Phone ID</th>
              <th className="p-4 font-medium">Device</th>
              <th className="p-4 font-medium">Stimuli used</th>
              <th className="p-4 font-medium">Session Timestamp</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Duration</th>
              <th className="p-4 font-medium"></th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {sessions.map((session, index) => (
              <tr key={`${session.id}-${index}`} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4 font-medium">{session.id}</td>
                <td className="p-4">{session.phoneId}</td>
                <td className="p-4">{session.device}</td>
                <td className="p-4">
                  <div className="flex gap-1.5 flex-wrap">
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
                <td className="p-4 text-muted-foreground">{session.timestamp}</td>
                <td className="p-4">
                  <Badge
                    variant={session.status === 'Completed' ? 'default' : 'destructive'}
                    className={
                      session.status === 'Completed'
                        ? 'bg-green-100 text-green-700 hover:bg-green-100'
                        : 'bg-red-100 text-red-700 hover:bg-red-100'
                    }
                  >
                    <span className="mr-1.5">●</span>
                    {session.status}
                  </Badge>
                </td>
                <td className="p-4">{session.duration}</td>
                <td className="p-4">
                  <button
                    onClick={() => navigate(`/sessions/${session.id}`)}
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">view</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t p-4">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium">1-10</span> from <span className="font-medium">46</span> data
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            ‹
          </Button>
          {[1, 2, 3, 4].map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPageChange(page)}
              className={currentPage === page ? 'bg-blue-600 hover:bg-blue-700' : ''}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            ›
          </Button>
        </div>
      </div>
    </>
  );
}
