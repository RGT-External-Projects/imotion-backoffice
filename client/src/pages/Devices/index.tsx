import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmptyState } from '@/components/EmptyState';
import EmptyStateImage from '@/assets/empty-state.svg';

const deviceData = [
  { id: 'D - 118', lastPhone: 'P-022', totalSessions: 212, lastActivity: '2 days ago', status: 'Active', firmware: 'v1.2.4' },
  { id: 'D - 103', lastPhone: 'P-789', totalSessions: 123, lastActivity: 'Yesterday', status: 'Active', firmware: 'v1.2.5' },
  { id: 'D - 129', lastPhone: 'P-341', totalSessions: 5, lastActivity: '14 Feb 2026', status: 'Active', firmware: 'v1.2.5' },
  { id: 'D- 218', lastPhone: 'P-787', totalSessions: 0, lastActivity: '13 Jun 2026', status: 'Offline', firmware: 'v1.2.3' },
  { id: 'D - 118', lastPhone: 'P-345', totalSessions: 10, lastActivity: '02 Feb 2026', status: 'Active', firmware: 'v1.2.2' },
];

export function Devices() {
  const navigate = useNavigate();
  const [hasData] = useState(true); // Toggle for empty state - set to false to see empty state
  const [searchQuery, setSearchQuery] = useState('');

  if (!hasData) {
    return (
      <div className="h-full p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search sessions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Register new device
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Empty State */}
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
            placeholder="Search sessions..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* <button
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Register new device
        </button> */}
      </div>

      {/* Filters */}
      <div className="mb-6">
        <Select defaultValue="all">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Devices Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-left text-sm text-muted-foreground">
                <th className="p-4 font-medium">Device ID</th>
                <th className="p-4 font-medium">Last connected phone</th>
                <th className="p-4 font-medium">Total Sessions</th>
                <th className="p-4 font-medium">Last activity</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Firmware</th>
                <th className="p-4 font-medium"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {deviceData.map((device, index) => (
                <tr key={index} className="border-b border-gray-200 last:border-0 hover:bg-gray-50">
                  <td className="p-4 font-medium">{device.id}</td>
                  <td className="p-4">{device.lastPhone}</td>
                  <td className="p-4">{device.totalSessions}</td>
                  <td className="p-4 text-muted-foreground">{device.lastActivity}</td>
                  <td className="p-4">
                    <Badge 
                      className={
                        device.status === 'Active'
                          ? 'bg-green-100 text-green-700 hover:bg-green-100'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                      }
                    >
                      <span className="mr-1.5">●</span>
                      {device.status}
                    </Badge>
                  </td>
                  <td className="p-4">{device.firmware}</td>
                  <td className="p-4">
                    <button
                      onClick={() => navigate(`/devices/${device.id}`)}
                      className="text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      👁 view
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
