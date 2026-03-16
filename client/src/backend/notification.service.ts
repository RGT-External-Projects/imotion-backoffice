import api from './api.service';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  isRead: boolean;
  createdAt: string;
}

export interface NotificationSettings {
  id: string;
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  sessionAlerts: boolean;
  deviceAlerts: boolean;
  systemUpdates: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateNotificationSettingsDto {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  sessionAlerts?: boolean;
  deviceAlerts?: boolean;
  systemUpdates?: boolean;
}

export const notificationService = {
  // Notifications
  getAll: () => api.get<Notification[]>('/notifications'),
  markAsRead: (id: string) => api.patch<Notification>(`/notifications/${id}/read`, {}),
  markAllAsRead: () => api.patch('/notifications/read-all', {}),
  delete: (id: string) => api.delete(`/notifications/${id}`),
  
  // Notification Settings
  getSettings: () => api.get<NotificationSettings>('/notification-settings'),
  updateSettings: (data: UpdateNotificationSettingsDto) => 
    api.patch<NotificationSettings>('/notification-settings', data),
};
