import api from './api.service';

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  diagnosis?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientDto {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  diagnosis?: string;
  notes?: string;
}

export interface UpdatePatientDto extends Partial<CreatePatientDto> {}

export const patientService = {
  getAll: () => api.get<Patient[]>('/patients'),
  getById: (id: string) => api.get<Patient>(`/patients/${id}`),
  create: (data: CreatePatientDto) => api.post<Patient>('/patients', data),
  update: (id: string, data: UpdatePatientDto) => api.patch<Patient>(`/patients/${id}`, data),
  delete: (id: string) => api.delete(`/patients/${id}`),
};
