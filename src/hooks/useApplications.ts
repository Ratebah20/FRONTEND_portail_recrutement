// Hook pour gérer les candidatures
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/src/services/api';
import { Application, ApplicationStatus } from '@/src/types';

// Hook pour récupérer toutes les candidatures
export function useApplications() {
  return useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const { data } = await apiClient.get('/applications');
      return data as Application[];
    },
  });
}

// Hook pour récupérer les statistiques
export function useApplicationStats() {
  const { data: applications, isLoading } = useApplications();
  
  const stats = applications ? {
    total: applications.length,
    submitted: applications.filter(a => a.status === ApplicationStatus.SUBMITTED).length,
    underReview: applications.filter(a => a.status === ApplicationStatus.UNDER_REVIEW).length,
    interview: applications.filter(a => a.status === ApplicationStatus.INTERVIEW).length,
    rejected: applications.filter(a => a.status === ApplicationStatus.REJECTED).length,
    accepted: applications.filter(a => a.status === ApplicationStatus.ACCEPTED).length,
  } : null;
  
  return { stats, isLoading };
}

// Hook pour mettre à jour le statut d'une candidature
export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: ApplicationStatus }) => {
      const { data } = await apiClient.put(`/applications/${id}/status`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}

// Hook pour lancer l'analyse IA
export function useAnalyzeApplication() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (applicationId: number) => {
      const { data } = await apiClient.post(`/applications/${applicationId}/analyze`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}