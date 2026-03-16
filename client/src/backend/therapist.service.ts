import api from './api.service';

export interface Therapist {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export const therapistService = {
  getAll: () => api.get<Therapist[]>('/therapists'),
  getById: (id: string) => api.get<Therapist>(`/therapists/${id}`),
  create: () => api.post<Therapist>('/therapists'),
  delete: (id: string) => api.delete(`/therapists/${id}`),
};
