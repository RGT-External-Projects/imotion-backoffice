const activityLogs = [
  { timestamp: 'February 26, 2026 - 09:11 AM', title: 'Session Started', description: 'Phone-02 initiated Session S1054 on device D-118 for patient P-233' },
  { timestamp: 'February 26, 2026 09:15 AM', title: 'Stimuli Configuration adjusted', description: 'Visual stimulus speed adjusted from Level 10 to Level 13 during Session S1054.' },
  { timestamp: 'February 26, 2026 09:23 AM', title: 'Session Paused', description: 'Session S1054 was paused by Phone-02 during the active test session.' },
  { timestamp: 'February 26, 2026 09:23 AM', title: 'Session Resumed', description: 'Session S1054 resumed after pause by Phone-02.' },
  { timestamp: 'February 26, 2026 09:45 AM', title: 'Session Completed', description: 'Session S1054 ended successfully with a duration of 8 minutes' },
  { timestamp: 'February 26, 2026 09:45 AM', title: 'Device Connected', description: 'Device D-118 connected to Phone-01 via Bluetooth.' },
];

export function ActivityTab() {
  return (
    <div>
      <h3 className="font-semibold mb-6 text-lg">Overview</h3>
      
      {/* Timeline */}
      <div className="space-y-8">
        {activityLogs.map((log, index) => (
          <div key={index} className="relative flex gap-4">
            {/* Timeline dot and line */}
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full border-2 border-blue-500 bg-white flex-shrink-0" />
              {index < activityLogs.length - 1 && (
                <div className="w-0.5 flex-1 bg-gray-200 mt-2" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
              <p className="text-sm text-gray-500 mb-2">{log.timestamp}</p>
              <h4 className="font-semibold text-gray-900 mb-3">{log.title}</h4>
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-sm text-gray-900 leading-relaxed">
                  {log.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
