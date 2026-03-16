import { useState } from 'react';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export function NotificationsTab() {
  const [emailNotifications, setEmailNotifications] = useState<NotificationSetting[]>([
    {
      id: 'sessionCompleted',
      label: 'Session Completed',
      description: 'Receive a summary when a therapy session ends.',
      enabled: true,
    },
    {
      id: 'newDevice',
      label: 'New Device Registered',
      description: 'Get notified when a new device is added to the system.',
      enabled: false,
    },
    {
      id: 'dailySummary',
      label: 'Daily Session Summary',
      description: 'Receive a summary of all sessions completed across the system.',
      enabled: true,
    },
  ]);

  const [pushNotifications, setPushNotifications] = useState<NotificationSetting[]>([
    {
      id: 'deviceDisconnected',
      label: 'Device Disconnected',
      description: 'Alert when an active device loses connection.',
      enabled: true,
    },
    {
      id: 'sessionInterrupted',
      label: 'Session Interrupted',
      description: 'Notify when a therapy session stops unexpectedly',
      enabled: true,
    },
  ]);

  const toggleEmailNotification = (id: string) => {
    setEmailNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, enabled: !notif.enabled } : notif
      )
    );
  };

  const togglePushNotification = (id: string) => {
    setPushNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, enabled: !notif.enabled } : notif
      )
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-8">Notifications</h2>

      <div className="space-y-12">
        {/* Email Notifications Row */}
        <div className="flex gap-16">
          {/* Left: Section Label */}
          <div className="w-48 flex-shrink-0">
            <h3 className="text-base font-semibold">Email Notifications</h3>
          </div>

          {/* Right: Notification Items */}
          <div className="flex-1 space-y-6">
            {emailNotifications.map((notification) => (
              <div key={notification.id} className="flex items-start gap-4">
                {/* Toggle Switch */}
                <button
                  onClick={() => toggleEmailNotification(notification.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer flex-shrink-0 ${
                    notification.enabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notification.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>

                {/* Text Content */}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{notification.label}</h4>
                  <p className="text-sm text-gray-600">{notification.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Push Notifications Row */}
        <div className="flex gap-16 border-t border-gray-200 pt-8">
          {/* Left: Section Label */}
          <div className="w-48 flex-shrink-0">
            <h3 className="text-base font-semibold">Push Notifications</h3>
          </div>

          {/* Right: Notification Items */}
          <div className="flex-1 space-y-6">
            {pushNotifications.map((notification) => (
              <div key={notification.id} className="flex items-start gap-4">
                {/* Toggle Switch */}
                <button
                  onClick={() => togglePushNotification(notification.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer flex-shrink-0 ${
                    notification.enabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notification.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>

                {/* Text Content */}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{notification.label}</h4>
                  <p className="text-sm text-gray-600">{notification.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
