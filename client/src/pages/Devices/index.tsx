import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmptyState } from '@/components/EmptyState';
import { useDevices } from '@/hooks/useDevices';
import { type DeviceQueryParams } from '@/backend/device.service';
import { exportToCSV, getDateString } from '@/lib/export';
import EmptyStateImage from '@/assets/empty-state.svg';

export function Devices() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<DeviceQueryParams>({
    page: 1,
    limit: 10,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const { data: deviceResponse, isLoading } = useDevices(filters);
  
  const devices = deviceResponse?.data || [];
  const meta = deviceResponse?.meta;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        search: searchTerm || undefined,
        page: 1,
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);


  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleExport = () => {
    if (!devices || devices.length === 0) return;

    const headers = ['Device ID', 'Device Name', 'Serial Number', 'Last Phone', 'Total Sessions', 'Last Activity', 'Firmware'];
    
    const exportData = devices.map(device => ({
      deviceId: device.deviceId,
      deviceName: device.deviceName,
      serialNumber: device.serialNumber,
      lastPhone: device.lastConnectedPhone?.phoneNumber || 'N/A',
      totalSessions: device.sessionCount || 0,
      lastActivity: device.lastConnected ? new Date(device.lastConnected).toLocaleDateString() : 'Never',
      firmware: device.firmwareVersion || 'N/A',
    }));

    exportToCSV(exportData, headers, `devices_export_${getDateString()}`);
  };

  const hasActiveFilters = !!filters.search;

  // Show empty state only if no filters and no data
  if (!isLoading && devices.length === 0 && !hasActiveFilters) {
    return (
      <div className="h-full p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search devices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button className="ml-4 gap-2 bg-blue-600 hover:bg-blue-700" onClick={handleExport} disabled>
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <EmptyState 
            icon={EmptyStateImage} 
            message="All registered iMotion devices will be seen here" 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search devices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Button className="ml-4 gap-2 bg-blue-600 hover:bg-blue-700" onClick={handleExport} disabled={devices.length === 0}>
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Devices Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-left text-sm text-muted-foreground bg-gray-50">
                <th className="p-4 font-medium">Device ID</th>
                <th className="p-4 font-medium">Last connected phone</th>
                <th className="p-4 font-medium">Total Sessions</th>
                <th className="p-4 font-medium">Last activity</th>
                <th className="p-4 font-medium">Firmware</th>
                <th className="p-4 font-medium"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {isLoading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-4"><Skeleton className="h-5 w-24" /></td>
                    <td className="p-4"><Skeleton className="h-5 w-28" /></td>
                    <td className="p-4"><Skeleton className="h-5 w-16" /></td>
                    <td className="p-4"><Skeleton className="h-5 w-24" /></td>
                    <td className="p-4"><Skeleton className="h-5 w-16" /></td>
                    <td className="p-4"><Skeleton className="h-5 w-12" /></td>
                  </tr>
                ))
              ) : devices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-muted-foreground text-lg mb-2">No devices found</p>
                      <p className="text-muted-foreground text-sm">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                devices.map((device) => (
                  <tr key={device.id} className="border-b border-gray-200 last:border-0 hover:bg-gray-50">
                    <td className="p-4 font-medium">{device.deviceId}</td>
                    <td className="p-4">{device.lastConnectedPhone?.phoneNumber || 'N/A'}</td>
                    <td className="p-4">{device.sessionCount || 0}</td>
                    <td className="p-4 text-muted-foreground">
                      {device.lastConnected 
                        ? new Date(device.lastConnected).toLocaleDateString() 
                        : 'Never'}
                    </td>
                    <td className="p-4">{device.firmwareVersion || 'N/A'}</td>
                    <td className="p-4">
                      <button
                        onClick={() => navigate(`/devices/${device.id}`)}
                        className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="text-sm">view</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t p-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{meta.totalItems === 0 ? 0 : (meta.currentPage - 1) * meta.itemsPerPage + 1}-{Math.min(meta.currentPage * meta.itemsPerPage, meta.totalItems)}</span> from <span className="font-medium">{meta.totalItems}</span> devices
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.max(1, meta.currentPage - 1))}
                disabled={meta.currentPage === 1 || isLoading}
              >
                ‹
              </Button>
              {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                let pageNum: number;
                if (meta.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (meta.currentPage <= 3) {
                  pageNum = i + 1;
                } else if (meta.currentPage >= meta.totalPages - 2) {
                  pageNum = meta.totalPages - 4 + i;
                } else {
                  pageNum = meta.currentPage - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={meta.currentPage === pageNum ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    disabled={isLoading}
                    className={meta.currentPage === pageNum ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.min(meta.totalPages, meta.currentPage + 1))}
                disabled={meta.currentPage === meta.totalPages || isLoading}
              >
                ›
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
