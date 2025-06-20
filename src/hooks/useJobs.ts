// Hook personnalisé pour gérer les offres d'emploi
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/src/services/api';

interface Job {
  id: number;
  title: string;
  description: string;
  department_id: number;
  department: {
    id: number;
    name: string;
  };
  requirements?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  application_count?: number;
}

interface JobFilters {
  department_id?: number;
  is_active?: boolean;
}

// Hook pour récupérer la liste des offres
export function useJobs(filters?: JobFilters) {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/jobs', { params: filters });
      return data as Job[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook pour récupérer une offre spécifique
export function useJob(id: number) {
  return useQuery({
    queryKey: ['jobs', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/jobs/${id}`);
      return data as Job;
    },
    enabled: !!id,
  });
}

// Hook pour créer une offre (RH uniquement)
export function useCreateJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (jobData: Partial<Job>) => {
      const { data } = await apiClient.post('/jobs', jobData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}

// Hook pour mettre à jour une offre
export function useUpdateJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...jobData }: Partial<Job> & { id: number }) => {
      const { data } = await apiClient.put(`/jobs/${id}`, jobData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['jobs', variables.id] });
    },
  });
}