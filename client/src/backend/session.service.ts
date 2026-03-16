import api from './api.service';

export interface SessionSettings {
  speed: number;
  visualSetting: string;
  vibrationSetting: string;
  audioSettings: Record<string, any>;
}

export interface Session {
  id: string;
  therapistId: string;
  patientIdentifier?: string;
  sessionSettings: SessionSettings;
  duration: number;
  sessionTimestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const sessionService = {
  getAll: () => api.get<Session[]>('/sessions'),
  getById: (id: string) => api.get<Session>(`/sessions/${id}`),
  getByTherapist: (therapistId: string) => api.get<Session[]>(`/therapists/${therapistId}/sessions`),
  create: (data: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>) => api.post<Session>('/sessions', data),
  delete: (id: string) => api.delete(`/sessions/${id}`),
};
