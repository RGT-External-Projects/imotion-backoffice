import api from './api.service';

export interface SessionSettings {
  vibration: {
    feedback: boolean;
    intensity: number;
    pulse: string;
  };
  audio: {
    feedback: boolean;
    volume: number;
    sound: string;
  };
  visual: {
    feedback: boolean;
    color: string;
    brightness: number;
    movement: string;
    speed: number;
  };
}

export interface SessionActivityLog {
  id: string;
  eventType: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface Session {
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
  };
}

export interface SessionDetails extends Session {
  activityLogs: SessionActivityLog[];
}

export interface SessionQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  deviceId?: string;
  status?: 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED' | 'INTERRUPTED';
  startDate?: string;
  endDate?: string;
  therapistPhoneId?: string;
  patientId?: string;
}

export interface PaginationMeta {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedSessionsResponse {
  data: Session[];
  meta: PaginationMeta;
}

export const sessionService = {
  getAll: (params?: SessionQueryParams) => {
    const queryString = params ? '?' + new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => [key, String(value)])
    ).toString() : '';
    return api.get<PaginatedSessionsResponse>(`/sessions${queryString}`);
  },
  getById: (id: string) => api.get<Session>(`/sessions/${id}`),
  delete: (id: string) => api.delete(`/sessions/${id}`),
};
