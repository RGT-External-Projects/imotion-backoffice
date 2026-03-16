import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { therapistService, type Therapist } from '@/backend/therapist.service';

// Query keys
export const therapistKeys = {
  all: ['therapists'] as const,
  detail: (id: string) => ['therapists', id] as const,
};

// Get all therapists
export const useTherapists = () => {
  return useQuery({
    queryKey: therapistKeys.all,
    queryFn: async () => {
      const response = await therapistService.getAll();
      return response.data;
    },
  });
};

// Get single therapist by ID
export const useTherapist = (id: string) => {
  return useQuery({
    queryKey: therapistKeys.detail(id),
    queryFn: async () => {
      const response = await therapistService.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

// Create therapist mutation
export const useCreateTherapist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await therapistService.create();
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: therapistKeys.all });
    },
  });
};

// Delete therapist mutation
export const useDeleteTherapist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await therapistService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: therapistKeys.all });
    },
  });
};
