import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/EmptyState';
import { SessionsFilters } from './components/SessionsFilters';
import { SessionsTable } from './components/SessionsTable';
import EmptyStateImage from '@/assets/empty-state.svg';

const sessionData = [
  { id: 'S1054', phoneId: 'P-021', device: 'D - 118', stimuli: ['Visual', 'Audio'], timestamp: '12 Jan 2026 • 09:15 AM', status: 'Completed' as const, duration: '8m' },
  { id: 'S1053', phoneId: 'P-034', device: 'D - 103', stimuli: ['Visual', 'Vibration'], timestamp: '02 Feb 2026 • 14:45 PM', status: 'Completed' as const, duration: '12m' },
  { id: 'S1052', phoneId: 'P-134', device: 'D -234', stimuli: ['Audio', 'Vibration'], timestamp: '23 Dec 2025 • 10:30 AM', status: 'Completed' as const, duration: '14m' },
  { id: 'S1051', phoneId: 'P-012', device: 'D - 129', stimuli: ['Audio'], timestamp: '03 Nov 2025 • 12:00 PM', status: 'Completed' as const, duration: '10m' },
  { id: 'S1050', phoneId: 'P-022', device: 'D-218', stimuli: ['Visual', 'Audio', 'Vibration'], timestamp: '02 Feb 2026 • 12:00 PM', status: 'Completed' as const, duration: '9m' },
  { id: 'S1054', phoneId: 'P-789', device: 'D - 118', stimuli: ['Visual', 'Audio', 'Vibration'], timestamp: '14 Feb 2026 • 10:30 AM', status: 'Completed' as const, duration: '8m' },
  { id: 'S1053', phoneId: 'P-341', device: 'D - 103', stimuli: ['Visual', 'Audio'], timestamp: '02 Feb 2026 • 12:00 PM', status: 'Completed' as const, duration: '12m' },
  { id: 'S1052', phoneId: 'P-787', device: 'D -234', stimuli: ['Visual', 'Vibration'], timestamp: '05 Apr 2026 • 10:38 AM', status: 'Interrupted' as const, duration: '14m' },
  { id: 'S1051', phoneId: 'P-345', device: 'D - 129', stimuli: ['Audio', 'Vibration'], timestamp: '13 Jun 2026 • 12:30 pM', status: 'Completed' as const, duration: '10m' },
  { id: 'S1050', phoneId: 'P-678', device: 'D-218', stimuli: ['Audio'], timestamp: '14 Feb 2026 • 10:30 AM', status: 'Completed' as const, duration: '9m' },
];

export function Sessions() {
  const [hasData] = useState(true); // Toggle to see empty state
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4;

  if (!hasData) {
    return (
      <div className="h-full p-6">
        <EmptyState icon={EmptyStateImage} message="Completed session logs will be displayed here" />
      </div>
    );
  }

  return (
    <div className="h-full p-6 overflow-auto">
      <SessionsFilters />
      
      <Card>
        <SessionsTable
          sessions={sessionData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </Card>
    </div>
  );
}
