import api from './api.service';

export interface Device {
  id: string;
  deviceId: string;
  deviceName: string;
  therapistId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const deviceService = {
  getAll: () => api.get<Device[]>('/devices'),
  getById: (id: string) => api.get<Device>(`/devices/${id}`),
  getByTherapist: (therapistId: string) => api.get<Device[]>(`/therapists/${therapistId}/devices`),
  create: (data: { deviceId: string; therapistId: string }) => api.post<Device>('/devices', data),
  delete: (id: string) => api.delete(`/devices/${id}`),
};
