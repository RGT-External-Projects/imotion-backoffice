import { useState } from 'react';
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

export function SessionsFilters() {
  const [dateRange, setDateRange] = useState('Custom date');
  const [device, setDevice] = useState('all');
  const [status, setStatus] = useState('all-status');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleDateSelect = (formattedRange: string) => {
    setDateRange(formattedRange);
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
            className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700 flex-shrink-0">
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
        <Select value={device} onValueChange={(value) => setDevice(value || 'all')}>
          <SelectTrigger className="w-[120px] h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">all</SelectItem>
            <SelectItem value="d118">D - 118</SelectItem>
            <SelectItem value="d103">D - 103</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(value) => setStatus(value || 'all-status')}>
          <SelectTrigger className="w-[140px] h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-status">all-status</SelectItem>
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
