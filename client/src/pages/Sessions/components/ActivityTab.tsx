import { format } from 'date-fns';
import type { SessionActivityLog } from '@/backend/session.service';

interface ActivityTabProps {
  activityLogs: SessionActivityLog[];
}

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
    'SESSION_PAUSED': 'Session Paused',
    'SESSION_RESUMED': 'Session Resumed',
    'SESSION_INTERRUPTED': 'Session Interrupted',
    'SETTINGS_CHANGED': 'Stimuli Configuration Adjusted',
    'DEVICE_CONNECTED': 'Device Connected',
    'DEVICE_DISCONNECTED': 'Device Disconnected',
  };
  return titles[eventType] || eventType;
};

export function ActivityTab({ activityLogs }: ActivityTabProps) {
  return (
    <div>
      <h3 className="font-semibold mb-6 text-lg">Activity</h3>
      
      {/* Timeline */}
      {activityLogs && activityLogs.length > 0 ? (
        <div className="space-y-8">
          {activityLogs.map((log, index) => (
            <div key={log.id} className="relative flex gap-4">
              {/* Timeline dot and line */}
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full border-2 border-blue-500 bg-white flex-shrink-0" />
                {index < activityLogs.length - 1 && (
                  <div className="w-0.5 flex-1 bg-gray-200 mt-2" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-6">
                <p className="text-sm text-gray-500 mb-2">
                  {formatTimelineTimestamp(log.timestamp)}
                </p>
                <h4 className="font-semibold text-gray-900 mb-3">
                  {getEventTitle(log.eventType)}
                </h4>
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-sm text-gray-900 leading-relaxed">
                    {log.description}
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
    </div>
  );
}
