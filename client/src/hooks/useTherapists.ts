import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/backend/api.service';

// Therapist Phone interface
export interface TherapistPhone {
  id: string;
  phoneNumber: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
}

// Query keys
export const therapistKeys = {
  all: ['therapist-phones'] as const,
  detail: (id: string) => ['therapist-phones', id] as const,
};

// Get all therapist phones
export const useTherapists = () => {
  return useQuery({
    queryKey: therapistKeys.all,
    queryFn: async () => {
      const response = await api.get<TherapistPhone[]>('/therapist-phones');
      return response.data;
    },
  });
};

// Get single therapist phone by ID
export const useTherapist = (id: string) => {
  return useQuery({
    queryKey: therapistKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<TherapistPhone>(`/therapist-phones/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Create therapist phone mutation
export const useCreateTherapist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { phoneNumber: string; displayName: string }) => {
      const response = await api.post<TherapistPhone>('/therapist-phones', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: therapistKeys.all });
    },
  });
};

// Delete therapist phone mutation
export const useDeleteTherapist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/therapist-phones/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: therapistKeys.all });
    },
  });
};
