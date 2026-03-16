import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  patientService, 
  type Patient, 
  type CreatePatientDto, 
  type UpdatePatientDto 
} from '@/backend/patient.service';

// Query keys
export const patientKeys = {
  all: ['patients'] as const,
  detail: (id: string) => ['patients', id] as const,
};

/**
 * Get all patients
 */
export const usePatients = () => {
  return useQuery({
    queryKey: patientKeys.all,
    queryFn: async () => {
      const response = await patientService.getAll();
      return response.data;
    },
  });
};

/**
 * Get single patient by ID
 */
export const usePatient = (id: string) => {
  return useQuery({
    queryKey: patientKeys.detail(id),
    queryFn: async () => {
      const response = await patientService.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

/**
 * Create patient mutation
 */
export const useCreatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePatientDto) => {
      const response = await patientService.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.all });
    },
  });
};

/**
 * Update patient mutation
 */
export const useUpdatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdatePatientDto }) => {
      const response = await patientService.update(id, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: patientKeys.all });
      queryClient.invalidateQueries({ queryKey: patientKeys.detail(variables.id) });
    },
  });
};

/**
 * Delete patient mutation
 */
export const useDeletePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await patientService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.all });
    },
  });
};

// Re-export types
export type { Patient, CreatePatientDto, UpdatePatientDto };
