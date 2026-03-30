import BluetoothIcon from '@/assets/icons/BluetoothIcon';
import FirmwareIcon from '@/assets/icons/FirmwareIcon';
import CalendarIcon from '@/assets/icons/CalendarIcon';

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
          <div className="flex items-center gap-2 mb-1">
            <BluetoothIcon size={16} color="black" />
            <p className="text-sm text-gray-500">Device ID</p>
          </div>
          <p className="text-xl font-semibold text-gray-900">{deviceId}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <FirmwareIcon size={16} color="black" />
            <p className="text-sm text-gray-500">Firmware</p>
          </div>
          <p className="text-xl font-semibold text-gray-900">
            {firmwareVersion || 'N/A'}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <CalendarIcon size={16} color="black" />
            <p className="text-sm text-gray-500">Last used</p>
          </div>
          <p className="text-xl font-semibold text-gray-900">{lastUsedDate}</p>
        </div>
      </div>
    </>
  );
}
