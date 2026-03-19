import { Smartphone, Activity, Clock } from 'lucide-react';

interface DeviceOverviewTabProps {
  deviceId: string;
  firmwareVersion: string | null;
  lastUsedDate: string;
}

export function DeviceOverviewTab({
  deviceId,
  firmwareVersion,
  lastUsedDate,
}: DeviceOverviewTabProps) {
  return (
    <>
      <h3 className="font-semibold mb-6 text-lg">Overview</h3>
      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Smartphone className="h-5 w-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-2">Device ID</p>
              <p className="text-xl font-semibold text-gray-900">{deviceId}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Activity className="h-5 w-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-2">Firmware</p>
              <p className="text-xl font-semibold text-gray-900">
                {firmwareVersion || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-2">Last used</p>
              <p className="text-xl font-semibold text-gray-900">{lastUsedDate}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
