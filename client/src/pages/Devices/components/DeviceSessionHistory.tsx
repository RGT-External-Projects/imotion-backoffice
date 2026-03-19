import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import type { DeviceSession } from '@/backend/device.service';

interface DeviceSessionHistoryProps {
  sessions: DeviceSession[];
}

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

export function DeviceSessionHistory({ sessions }: DeviceSessionHistoryProps) {
  const [sessionPage, setSessionPage] = useState(1);
  const sessionsPerPage = 10;

  // Pagination calculations
  const totalSessions = sessions?.length || 0;
  const totalSessionPages = Math.ceil(totalSessions / sessionsPerPage);
  const sessionStartIndex = (sessionPage - 1) * sessionsPerPage;
  const sessionEndIndex = sessionStartIndex + sessionsPerPage;
  const paginatedSessions = sessions?.slice(sessionStartIndex, sessionEndIndex) || [];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Session History ({totalSessions})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sessions && sessions.length > 0 ? (
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
  );
}
