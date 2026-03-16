import api from './api.service';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InviteUserDto {
  email: string;
  role: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  role?: string;
  isActive?: boolean;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export const userService = {
  // User management
  getAll: () => api.get<User[]>('/users'),
  getById: (id: string) => api.get<User>(`/users/${id}`),
  inviteUser: (data: InviteUserDto) => api.post<User>('/users/invite', data),
  update: (id: string, data: UpdateUserDto) => api.patch<User>(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
  
  // Profile management
  getProfile: () => api.get<User>('/users/profile'),
  updateProfile: (data: UpdateProfileDto) => api.patch<User>('/users/profile', data),
};
