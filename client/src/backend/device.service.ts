import api from './api.service';

export interface Device {
  id: string;
  deviceId: string;
  deviceName: string;
  serialNumber: string;
  isActive: boolean;
  firmwareVersion: string;
  lastConnected: string | null;
  createdAt: string;
  updatedAt: string;
  sessionCount?: number;
  lastConnectedPhone?: {
    id: string;
    phoneNumber: string;
    displayName: string;
  } | null;
}

export interface DeviceQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  firmwareVersion?: string;
}

export interface PaginatedDevicesResponse {
  data: Device[];
  meta: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const deviceService = {
  getAll: () => api.get<Device[]>('/devices'),
  
  getAllPaginated: (params?: DeviceQueryParams) => 
    api.get<PaginatedDevicesResponse>('/devices/paginated', { params }),
  
  getById: (id: string) => api.get<Device>(`/devices/${id}`),
  
  getByTherapist: (therapistId: string) => api.get<Device[]>(`/therapists/${therapistId}/devices`),
  
  create: (data: { deviceId: string; therapistId: string }) => api.post<Device>('/devices', data),
  
  delete: (id: string) => api.delete(`/devices/${id}`),
};
