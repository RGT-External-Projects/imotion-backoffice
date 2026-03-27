import { useState, useEffect } from 'react';
import { Search, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { DateRangePicker } from '@/components/DateRangePicker';
import { type SessionQueryParams } from '@/backend/session.service';
import { useDevices } from '@/hooks/useDevices';

interface SessionsFiltersProps {
  onFilterChange: (filters: Partial<SessionQueryParams>) => void;
  currentFilters: SessionQueryParams;
  onExport: () => void;
  hasData: boolean;
}

export function SessionsFilters({ onFilterChange, currentFilters, onExport, hasData }: SessionsFiltersProps) {
  const [dateRange, setDateRange] = useState('Custom date');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  const { data: devicesResponse } = useDevices();
  const devices = devicesResponse?.data || [];
  
  // Use current filter values for controlled components
  const device = currentFilters.deviceId || 'all';
  const status = currentFilters.status?.toLowerCase().replace('_', ' ') || 'all-status';

  // Get display text for selected device
  const getDeviceDisplayText = () => {
    if (device === 'all') return 'All Devices';
    const selectedDevice = devices.find(d => d.id === device);
    if (!selectedDevice) return 'All Devices';
    if (selectedDevice.deviceName && selectedDevice.deviceName !== selectedDevice.deviceId) {
      return `${selectedDevice.deviceName} (${selectedDevice.deviceId})`;
    }
    return selectedDevice.deviceId;
  };

  // Get display text for selected status
  const getStatusDisplayText = () => {
    if (status === 'all-status') return 'All Status';
    if (status === 'in progress') return 'In Progress';
    if (status === 'paused') return 'Paused';
    if (status === 'completed') return 'Completed';
    if (status === 'interrupted') return 'Interrupted';
    return 'All Status';
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        onFilterChange({ search: searchTerm });
      } else {
        onFilterChange({ search: undefined });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleDateSelect = (formattedRange: string, startDate?: Date, endDate?: Date) => {
    setDateRange(formattedRange);
    
    if (startDate && endDate) {
      onFilterChange({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
    } else {
      onFilterChange({
        startDate: undefined,
        endDate: undefined,
      });
    }
  };

  const handleDeviceChange = (value: string | null) => {
    const deviceValue = value || 'all';
    onFilterChange({
      deviceId: deviceValue === 'all' ? undefined : deviceValue,
    });
  };

  const handleStatusChange = (value: string | null) => {
    const statusValue = value || 'all-status';
    if (statusValue === 'all-status') {
      onFilterChange({ status: undefined });
    } else {
      onFilterChange({ 
        status: statusValue.toUpperCase().replace(' ', '_') as 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED' | 'INTERRUPTED'
      });
    }
  };

  return (
    <>
      {/* Search and Export Row */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Button 
          className="gap-2 bg-blue-600 hover:bg-blue-700 flex-shrink-0 cursor-pointer"
          onClick={onExport}
          disabled={!hasData}
        >
          <span>Export</span>
          <Download className="h-4 w-4" />
        </Button>
      </div>

      {/* Filters Row */}
      <div className="mb-6 flex items-center gap-3">
        <Button 
          variant="outline" 
          className="gap-2 h-10 cursor-pointer" 
          onClick={() => setIsDatePickerOpen(true)}
        >
          <Calendar className="h-4 w-4" />
          <span className="text-sm">{dateRange}</span>
        </Button>
        <Select value={device} onValueChange={handleDeviceChange}>
          <SelectTrigger className="w-[240px]">
            <span className="text-sm truncate">{getDeviceDisplayText()}</span>
          </SelectTrigger>
          <SelectContent className="max-w-[280px] max-h-[300px] overflow-y-auto">
            <SelectItem value="all">All Devices</SelectItem>
            {devices?.map((d) => {
              const fullText = d.deviceName && d.deviceName !== d.deviceId 
                ? `${d.deviceName} (${d.deviceId})`
                : d.deviceId;
              // Show only device ID in list for clean display
              return (
                <SelectItem 
                  key={d.id} 
                  value={d.id}
                  title={fullText}
                >
                  {d.deviceId}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[160px] h-10">
            <span className="text-sm">{getStatusDisplayText()}</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-status">All Status</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="interrupted">Interrupted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Date Range Picker Modal */}
      <DateRangePicker
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onSelect={handleDateSelect}
        currentRange={dateRange}
      />
    </>
  );
}
