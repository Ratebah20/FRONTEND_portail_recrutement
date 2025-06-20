'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatedText } from '@/src/components/animations/AnimatedText';
import { useApplications, useUpdateApplicationStatus } from '@/src/hooks/useApplications';
import { ApplicationStatus } from '@/src/types';
import { Search, Filter, Grid3X3, List, Brain, Download, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

const statusColumns = [
  { id: ApplicationStatus.SUBMITTED, title: 'Nouvelles', color: 'bg-blue-100 border-blue-300' },
  { id: ApplicationStatus.UNDER_REVIEW, title: 'En cours', color: 'bg-yellow-100 border-yellow-300' },
  { id: ApplicationStatus.INTERVIEW, title: 'Entretien', color: 'bg-purple-100 border-purple-300' },
  { id: ApplicationStatus.ACCEPTED, title: 'Acceptées', color: 'bg-green-100 border-green-300' },
  { id: ApplicationStatus.REJECTED, title: 'Refusées', color: 'bg-red-100 border-red-300' },
];

export default function ApplicationsPage() {
  const router = useRouter();
  const { data: applications, isLoading } = useApplications();
  const { mutate: updateStatus } = useUpdateApplicationStatus();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const filteredApplications = applications?.filter(app => {
    const searchLower = searchTerm.toLowerCase();
    return (
      app.candidate.first_name.toLowerCase().includes(searchLower) ||
      app.candidate.last_name.toLowerCase().includes(searchLower) ||
      app.job.title.toLowerCase().includes(searchLower)
    );
  });

  const handleDragStart = (e: React.DragEvent, applicationId: number) => {
    setDraggedItem(applicationId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: ApplicationStatus) => {
    e.preventDefault();
    if (draggedItem) {
      updateStatus({ id: draggedItem, status: newStatus });
      setDraggedItem(null);
    }
  };

  const getApplicationsByStatus = (status: ApplicationStatus) => {
    return filteredApplications?.filter(app => app.status === status) || [];
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <AnimatedText
            text="Gestion des candidatures"
            className="text-4xl font-bold mb-2"
            animation="slideUp"
          />
          <p className="text-muted-foreground">
            Gérez et suivez toutes les candidatures en cours
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher par nom ou poste..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('kanban')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Kanban View */}
        {viewMode === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {statusColumns.map((column) => (
              <div
                key={column.id}
                className={`border-2 rounded-lg p-4 min-h-[600px] ${column.color}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{column.title}</h3>
                  <Badge variant="secondary">
                    {getApplicationsByStatus(column.id).length}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-32" />
                    ))
                  ) : (
                    getApplicationsByStatus(column.id).map((app) => (
                      <Card
                        key={app.id}
                        className="p-4 cursor-move hover:shadow-lg transition-shadow bg-white"
                        draggable
                        onDragStart={(e) => handleDragStart(e, app.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">
                            {app.candidate.first_name} {app.candidate.last_name}
                          </h4>
                          {app.ai_score && (
                            <Badge variant="outline" className="text-xs">
                              {app.ai_score}%
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-1">
                          {app.job.title}
                        </p>
                        {app.job.department_name && (
                          <p className="text-xs text-muted-foreground mb-3">
                            {app.job.department_name}
                          </p>
                        )}
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2"
                            onClick={() => router.push(`/hr/applications/${app.id}`)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Voir
                          </Button>
                          {!app.ai_score && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2"
                            >
                              <Brain className="h-3 w-3 mr-1" />
                              Analyser
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <Card className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Candidat</th>
                    <th className="text-left p-2">Poste</th>
                    <th className="text-left p-2">Département</th>
                    <th className="text-left p-2">Statut</th>
                    <th className="text-left p-2">Score IA</th>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="text-center p-8">
                        <Skeleton className="h-8 w-full" />
                      </td>
                    </tr>
                  ) : (
                    filteredApplications?.map((app) => {
                      const statusBadge = statusColumns.find(s => s.id === app.status);
                      return (
                        <tr key={app.id} className="border-b hover:bg-muted/50">
                          <td className="p-2">
                            {app.candidate.first_name} {app.candidate.last_name}
                          </td>
                          <td className="p-2">{app.job.title}</td>
                          <td className="p-2">{app.job.department_name || 'Non défini'}</td>
                          <td className="p-2">
                            <Badge variant="outline" className="text-xs">
                              {statusBadge?.title}
                            </Badge>
                          </td>
                          <td className="p-2">
                            {app.ai_score ? `${app.ai_score}%` : '-'}
                          </td>
                          <td className="p-2">
                            {new Date(app.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-2">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => router.push(`/hr/applications/${app.id}`)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {!app.ai_score && (
                                <Button size="sm" variant="ghost">
                                  <Brain className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}