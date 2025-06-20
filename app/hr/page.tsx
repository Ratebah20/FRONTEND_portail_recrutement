'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AnimatedText } from '@/src/components/animations/AnimatedText';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { StatsVisualization } from '@/src/components/3d/StatsVisualization';
import { useApplicationStats, useApplications } from '@/src/hooks/useApplications';
import { useJobs } from '@/src/hooks/useJobs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  TrendingUp,
  FileText,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { ApplicationStatus } from '@/src/types';

export default function HRDashboard() {
  const { stats, isLoading: statsLoading } = useApplicationStats();
  const { data: applications, isLoading: appsLoading } = useApplications();
  const { data: jobs } = useJobs();
  
  // Préparer les données pour la visualisation 3D
  const stats3DData = stats ? [
    { label: 'Total', value: stats.total, color: '#3b82f6' },
    { label: 'Nouvelles', value: stats.submitted, color: '#f59e0b' },
    { label: 'En cours', value: stats.underReview, color: '#10b981' },
    { label: 'Entretiens', value: stats.interview, color: '#8b5cf6' },
    { label: 'Acceptées', value: stats.accepted, color: '#10b981' },
  ] : [];
  
  const statsCards = [
    { label: 'Candidatures totales', value: stats?.total || 0, icon: FileText, trend: '+12%', color: 'text-blue-600' },
    { label: 'En cours d\'examen', value: stats?.underReview || 0, icon: Clock, trend: '+5%', color: 'text-yellow-600' },
    { label: 'Entretiens planifiés', value: stats?.interview || 0, icon: Calendar, trend: '+8%', color: 'text-purple-600' },
    { label: 'Candidats acceptés', value: stats?.accepted || 0, icon: UserCheck, trend: '+15%', color: 'text-green-600' },
  ];
  
  const getStatusBadge = (status: ApplicationStatus) => {
    const badges = {
      [ApplicationStatus.SUBMITTED]: { label: 'Nouveau', class: 'bg-blue-100 text-blue-700' },
      [ApplicationStatus.UNDER_REVIEW]: { label: 'En cours', class: 'bg-yellow-100 text-yellow-700' },
      [ApplicationStatus.INTERVIEW]: { label: 'Entretien', class: 'bg-purple-100 text-purple-700' },
      [ApplicationStatus.REJECTED]: { label: 'Refusé', class: 'bg-red-100 text-red-700' },
      [ApplicationStatus.ACCEPTED]: { label: 'Accepté', class: 'bg-green-100 text-green-700' },
    };
    return badges[status] || { label: 'Inconnu', class: 'bg-gray-100 text-gray-700' };
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <AnimatedText 
          text="Tableau de bord RH" 
          className="text-4xl font-bold mb-2"
          animation="slideUp"
        />
        <p className="text-muted-foreground">
          Gérez vos candidatures et suivez le processus de recrutement
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))
        ) : (
          statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className={`text-sm font-medium ${stat.color}`}>
                    {stat.trend}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            );
          })
        )}
      </div>
      
      {/* Visualisation 3D des statistiques */}
      {!statsLoading && stats && (
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Visualisation 3D des candidatures</h2>
          <StatsVisualization stats={stats3DData} />
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Applications */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Candidatures récentes</h2>
              <Button variant="outline" size="sm">
                Voir tout
              </Button>
            </div>
            
            <div className="space-y-4">
              {appsLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20" />
                ))
              ) : (
                applications?.slice(0, 5).map((app) => {
                  const statusBadge = getStatusBadge(app.status);
                  return (
                    <div key={app.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex-1">
                        <h3 className="font-medium">{app.candidate.first_name} {app.candidate.last_name}</h3>
                        <p className="text-sm text-muted-foreground">{app.job.title}</p>
                        {app.job.department_name && (
                          <p className="text-xs text-muted-foreground mt-1">{app.job.department_name}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {app.ai_score && (
                          <div className="text-right">
                            <p className="text-sm font-medium">Score IA</p>
                            <p className="text-2xl font-bold text-primary">{Math.round(app.ai_score)}%</p>
                          </div>
                        )}
                        
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.class}`}>
                          {statusBadge.label}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Briefcase className="mr-2 h-4 w-4" />
                Créer une offre d'emploi
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Gérer les candidatures
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Planifier un entretien
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                Voir les analytics
              </Button>
            </div>
          </Card>

          {/* AI Analysis Card */}
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-purple-500/10">
            <div className="flex items-center mb-4">
              <CheckCircle className="h-8 w-8 text-primary mr-3" />
              <h2 className="text-xl font-semibold">Analyse IA</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Utilisez l'IA pour analyser automatiquement les CV et obtenir un score de correspondance
            </p>
            <Button className="w-full">
              Lancer une analyse
            </Button>
          </Card>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}