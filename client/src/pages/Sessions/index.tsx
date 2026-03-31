import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/EmptyState';
import { SessionsFilters } from './components/SessionsFilters';
import { SessionsTable } from './components/SessionsTable';
import { useSessions } from '@/hooks/useSessions';
import { type SessionQueryParams } from '@/backend/session.service';
import { exportToCSV, getDateString } from '@/lib/export';
import EmptyStateImage from '@/assets/empty-state.svg';

// Helper to extract stimuli from settings
const extractStimuli = (settings: any): string[] => {
  const stimuli: string[] = [];
  
  // Check if each stimulus type exists
  if (settings?.visual) stimuli.push('Visual');
  if (settings?.audio) stimuli.push('Audio');
  if (settings?.vibration || settings?.tactile) stimuli.push('Vibration'); // Fallback for old data
  
  return stimuli;
};

// Helper to format duration (include seconds, same as SessionDetails view)
const formatDuration = (seconds: number | null): string => {
  if (!seconds) return 'N/A';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}m ${secs}s`;
};

export function Sessions() {
  const [filters, setFilters] = useState<SessionQueryParams>({
    page: 1,
    limit: 10,
  });

  const { data: sessionResponse, isLoading } = useSessions(filters);
  
  // Extract sessions and metadata from response
  const sessions = sessionResponse?.data || [];
  const meta = sessionResponse?.meta;

  // Transform backend data to table format
  const transformedSessions = sessions.map((session, _index) => {
    // Keep _index parameter for potential future use (e.g. row numbering)
    // and to match your preferred style, but avoid TS unused-variable error
    void _index;
    // Map backend status to display status
    let displayStatus: 'In Progress' | 'Paused' | 'Completed' | 'Interrupted';
    switch (session.status) {
      case 'IN_PROGRESS':
        displayStatus = 'In Progress';
        break;
      case 'PAUSED':
        displayStatus = 'Paused';
        break;
      case 'COMPLETED':
        displayStatus = 'Completed';
        break;
      case 'INTERRUPTED':
        displayStatus = 'Interrupted';
        break;
      default:
        displayStatus = 'Interrupted';
    }

    return {
      id: session.id, // Keep full UUID for navigation
      // Use the same short ID format as the dashboard (first 8 chars of UUID)
      displayId: session.id.substring(0, 8).toUpperCase(),
      phoneId: session.therapistPhone?.phoneNumber || 'Unknown',
      device: session.device?.deviceName || 'Unknown',
      stimuli: extractStimuli(session.finalSettings || session.initialSettings),
      timestamp: new Date(session.sessionTimestamp).toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).replace(',', ' •'),
      status: displayStatus,
      duration: formatDuration(session.duration),
    };
  });

 
  // Handler for page change
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // Handler for filter changes
  const handleFilterChange = (newFilters: Partial<SessionQueryParams>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 })); // Reset to page 1 on filter change
  };

  // Handler for export
  const handleExport = () => {
    if (!transformedSessions || transformedSessions.length === 0) return;

    // Define headers
    const headers = ['Session ID', 'Phone ID', 'Device', 'Stimuli', 'Timestamp', 'Status', 'Duration'];
    
    // Prepare data for export (remove the 'id' field used for navigation)
    const exportData = transformedSessions.map(({ id, ...session }) => session);

    // Use reusable export utility
    exportToCSV(exportData, headers, `sessions_export_${getDateString()}`);
  };

  // Check if there are any active filters
  const hasActiveFilters = !!(filters.search || filters.deviceId || filters.status || filters.startDate || filters.endDate);

  // Only show empty state if no filters are applied and there's no data
  if (!isLoading && (!sessions || sessions.length === 0) && !hasActiveFilters) {
    return (
      <div className="h-full p-6">
        <EmptyState icon={EmptyStateImage} message="Completed session logs will be displayed here" />
      </div>
    );
  }

  return (
    <div className="h-full p-6 overflow-auto">
      <SessionsFilters 
        onFilterChange={handleFilterChange} 
        currentFilters={filters}
        onExport={handleExport}
        hasData={transformedSessions.length > 0}
      />
      
      <Card>
        <SessionsTable
          sessions={transformedSessions}
          currentPage={meta?.currentPage || 1}
          totalPages={meta?.totalPages || 1}
          totalItems={meta?.totalItems || 0}
          itemsPerPage={meta?.itemsPerPage || 10}
          onPageChange={handlePageChange}
          isLoading={isLoading}
          hasActiveFilters={hasActiveFilters}
        />
      </Card>
    </div>
  );
}
