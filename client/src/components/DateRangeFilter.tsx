import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

type DateRange = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'custom';

interface DateRangeFilterProps {
  onRangeChange?: (range: DateRange) => void;
}

export function DateRangeFilter({ onRangeChange }: DateRangeFilterProps) {
  const [selectedRange, setSelectedRange] = useState<DateRange>('1M');

  const ranges: DateRange[] = ['1D', '1W', '1M', '3M', '6M', '1Y'];

  const handleRangeClick = (range: DateRange) => {
    setSelectedRange(range);
    onRangeChange?.(range);
  };

  return (
    <div className="flex items-center gap-3">
      {/* Range Buttons */}
      <div className="flex bg-white rounded-lg border border-gray-200 p-1">
        {ranges.map((range) => (
          <button
            key={range}
            onClick={() => handleRangeClick(range)}
            className={cn(
              'px-5 py-2 text-sm font-medium rounded-md transition-colors',
              selectedRange === range
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Custom Date Button */}
      <button
        onClick={() => handleRangeClick('custom')}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
          selectedRange === 'custom'
            ? 'bg-gray-100 border-gray-300 text-gray-900'
            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
        )}
      >
        <Calendar className="h-4 w-4" />
        <span className="text-sm font-medium">Custom date</span>
      </button>
    </div>
  );
}
