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

export interface SessionSettings {
  visual: {
    enabled: boolean;
    color: string;
    speed: number;
    movement: string;
  };
  vibration: {
    enabled: boolean;
    intensity: number;
    pulse: string;
    speed: number;
  };
  audio: {
    enabled: boolean;
    volume?: number;
    type?: string;
  };
}

export interface DeviceSession {
  id: string;
  deviceId: string;
  therapistPhoneId: string;
  patientId: string;
  initialSettings: SessionSettings;
  finalSettings?: SessionSettings;
  status: 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED' | 'INTERRUPTED';
  duration: number | null;
  sessionTimestamp: string;
  createdAt: string;
  updatedAt: string;
  device?: {
    id: string;
    deviceId: string;
    deviceName: string;
  };
  therapistPhone?: {
    id: string;
    phoneNumber: string;
    displayName: string;
  };
  patient?: {
    id: string;
    patientCode: string;
    name: string;
  };
}

export interface DeviceActivityLog {
  id: string;
  deviceId: string;
  timestamp: string;
  eventType: string;
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface TherapistPhoneConnection {
  id: string;
  phoneNumber: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
  sessionsRun: number;
  lastConnected: string;
}

export interface DeviceDetails extends Device {
  sessions: DeviceSession[];
  activityLogs: DeviceActivityLog[];
  therapistPhones: TherapistPhoneConnection[];
  statistics: {
    totalSessions: number;
    avgSessionDuration: number;
    avgSessionDurationFormatted: string;
    phonesConnected: number;
  };
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
  
  getById: (id: string) => api.get<DeviceDetails>(`/devices/${id}`),
  
  getSessions: (id: string) => api.get<DeviceSession[]>(`/devices/${id}/sessions`),
  
  getActivityLogs: (id: string) => api.get<DeviceActivityLog[]>(`/devices/${id}/activity-logs`),
  
  getTherapistPhones: (id: string) => api.get<TherapistPhoneConnection[]>(`/devices/${id}/therapist-phones`),
  
  getByTherapist: (therapistId: string) => api.get<Device[]>(`/therapists/${therapistId}/devices`),
  
  create: (data: { deviceId: string; therapistId: string }) => api.post<Device>('/devices', data),
  
  delete: (id: string) => api.delete(`/devices/${id}`),
};
