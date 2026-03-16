import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deviceService, type Device } from '@/backend/device.service';

// Query keys
export const deviceKeys = {
  all: ['devices'] as const,
  detail: (id: string) => ['devices', id] as const,
  byTherapist: (therapistId: string) => ['devices', 'therapist', therapistId] as const,
};

// Get all devices
export const useDevices = () => {
  return useQuery({
    queryKey: deviceKeys.all,
    queryFn: async () => {
      const response = await deviceService.getAll();
      return response.data;
    },
  });
};

// Get single device by ID
export const useDevice = (id: string) => {
  return useQuery({
    queryKey: deviceKeys.detail(id),
    queryFn: async () => {
      const response = await deviceService.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

// Get devices by therapist
export const useDevicesByTherapist = (therapistId: string) => {
  return useQuery({
    queryKey: deviceKeys.byTherapist(therapistId),
    queryFn: async () => {
      const response = await deviceService.getByTherapist(therapistId);
      return response.data;
    },
    enabled: !!therapistId,
  });
};

// Create device mutation
export const useCreateDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { deviceId: string; therapistId: string }) => {
      const response = await deviceService.create(data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: deviceKeys.all });
      queryClient.invalidateQueries({ 
        queryKey: deviceKeys.byTherapist(variables.therapistId) 
      });
    },
  });
};

// Delete device mutation
export const useDeleteDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await deviceService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deviceKeys.all });
    },
  });
};
