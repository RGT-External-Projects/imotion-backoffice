import api from './api.service';

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
    deviceName: string;
  };
  therapistPhone?: {
    id: string;
    phoneNumber: string;
  };
  patient?: {
    id: string;
    patientIdentifier: string;
  };
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
