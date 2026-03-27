import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

interface Session {
  id: string; // Full UUID for navigation
  displayId: string; // Friendly display ID (S-0001)
  phoneId: string;
  device: string;
  stimuli: string[];
  timestamp: string;
  status: 'In Progress' | 'Paused' | 'Completed' | 'Interrupted';
  duration: string;
}

interface SessionsTableProps {
  sessions: Session[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  hasActiveFilters?: boolean;
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

export function SessionsTable({ sessions, currentPage, totalPages, totalItems, itemsPerPage, onPageChange, isLoading = false, hasActiveFilters = false }: SessionsTableProps) {
  const navigate = useNavigate();

  // Show message when filters are active but no results
  const showNoResultsMessage = !isLoading && sessions.length === 0 && hasActiveFilters;

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
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 10 }).map((_, index) => (
                <tr key={index} className="border-b">
                  <td className="p-4"><Skeleton className="h-5 w-20" /></td>
                  <td className="p-4"><Skeleton className="h-5 w-24" /></td>
                  <td className="p-4"><Skeleton className="h-5 w-28" /></td>
                  <td className="p-4"><Skeleton className="h-6 w-32" /></td>
                  <td className="p-4"><Skeleton className="h-5 w-40" /></td>
                  <td className="p-4"><Skeleton className="h-6 w-20" /></td>
                  <td className="p-4"><Skeleton className="h-5 w-12" /></td>
                  <td className="p-4"><Skeleton className="h-5 w-16" /></td>
                </tr>
              ))
            ) : showNoResultsMessage ? (
              <tr>
                <td colSpan={8} className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-muted-foreground text-lg mb-2">No sessions found</p>
                    <p className="text-muted-foreground text-sm">Try adjusting your filters to find what you're looking for</p>
                  </div>
                </td>
              </tr>
            ) : (
              sessions.map((session, index) => (
              <tr key={`${session.id}-${index}`} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4 font-medium whitespace-nowrap">{session.displayId}</td>
                <td className="p-4 whitespace-nowrap">{session.phoneId}</td>
                <td className="p-4 whitespace-nowrap">{session.device}</td>
                <td className="p-4">
                  <div className="flex gap-1.5 flex-wrap">
                    {session.stimuli.length > 0 ? (
                      session.stimuli.map((s) => (
                        <Badge
                          key={s}
                          variant="secondary"
                          className={getStimuliColor(s)}
                        >
                          {s}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-xs">No stimuli</span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-muted-foreground whitespace-nowrap">{session.timestamp}</td>
                <td className="p-4">
                  <Badge
                    variant={session.status === 'Completed' ? 'default' : session.status === 'Interrupted' ? 'destructive' : 'secondary'}
                    className={
                      session.status === 'Completed'
                        ? 'bg-green-100 text-green-700 hover:bg-green-100'
                        : session.status === 'Interrupted'
                        ? 'bg-red-100 text-red-700 hover:bg-red-100'
                        : session.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - only show when more than one page */}
      {totalPages > 1 && (
      <div className="flex items-center justify-between border-t p-4">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)}</span> from <span className="font-medium">{totalItems}</span> data
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1 || isLoading}
          >
            ‹
          </Button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                disabled={isLoading}
                className={currentPage === pageNum ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                {pageNum}
              </Button>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || isLoading}
          >
            ›
          </Button>
        </div>
      </div>
      )}
    </>
  );
}
