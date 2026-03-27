import { useState, useEffect } from 'react';
import { Search, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
  const status = currentFilters.status?.toLowerCase() || 'all-status';

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
  }, [searchTerm, onFilterChange]);

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
        status: statusValue.toUpperCase() as 'COMPLETED' | 'INTERRUPTED'
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
          <SelectTrigger className="w-[180px] h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Devices</SelectItem>
            {devices?.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.deviceName || d.deviceId}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[140px] h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-status">All Status</SelectItem>
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
