import { format } from 'date-fns';
import type { DeviceActivityLog } from '@/backend/device.service';

interface DeviceTimelineTabProps {
  activityLogs: DeviceActivityLog[];
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

export function DeviceTimelineTab({ activityLogs }: DeviceTimelineTabProps) {
  return (
    <>
      <h3 className="font-semibold mb-6 text-lg">Timeline</h3>
      {activityLogs && activityLogs.length > 0 ? (
        <div className="space-y-8">
          {activityLogs.map((event, index) => (
            <div key={event.id} className="relative flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full border-2 border-blue-500 bg-white flex-shrink-0" />
                {index < activityLogs.length - 1 && (
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
  );
}
