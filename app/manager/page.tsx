'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatedText } from '@/src/components/animations/AnimatedText';
import { InterviewCalendar } from '@/src/components/manager/InterviewCalendar';
import { CandidatesList } from '@/src/components/manager/CandidatesList';
import { DepartmentStats } from '@/src/components/manager/DepartmentStats';
import { RecruitmentPipeline3D } from '@/src/components/3d/RecruitmentPipeline3D';
import { 
  Calendar, 
  Users, 
  BarChart3, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

export default function ManagerDashboard() {
  const [selectedView, setSelectedView] = useState('calendar');

  // Stats du département (à remplacer par des données réelles)
  const stats = {
    totalPositions: 5,
    activeRecruitments: 3,
    scheduledInterviews: 8,
    pendingDecisions: 4,
    monthlyHires: 2,
    averageTimeToHire: 23
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <AnimatedText
            text="Dashboard Manager"
            className="text-4xl font-bold mb-2"
            animation="slideUp"
          />
          <p className="text-muted-foreground">
            Gérez vos entretiens et suivez vos recrutements
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Entretiens planifiés</p>
                <p className="text-2xl font-bold">{stats.scheduledInterviews}</p>
                <p className="text-xs text-muted-foreground mt-1">Cette semaine</p>
              </div>
              <Calendar className="h-8 w-8 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En attente de décision</p>
                <p className="text-2xl font-bold">{stats.pendingDecisions}</p>
                <p className="text-xs text-muted-foreground mt-1">Candidats</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Recrutements actifs</p>
                <p className="text-2xl font-bold">{stats.activeRecruitments}</p>
                <p className="text-xs text-muted-foreground mt-1">Postes ouverts</p>
              </div>
              <Users className="h-8 w-8 text-green-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Temps moyen</p>
                <p className="text-2xl font-bold">{stats.averageTimeToHire}j</p>
                <p className="text-xs text-muted-foreground mt-1">Pour recruter</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Calendar and Lists */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <Tabs value={selectedView} onValueChange={setSelectedView}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="calendar">Calendrier</TabsTrigger>
                  <TabsTrigger value="candidates">Candidats</TabsTrigger>
                  <TabsTrigger value="stats">Statistiques</TabsTrigger>
                </TabsList>

                <TabsContent value="calendar" className="mt-6">
                  <InterviewCalendar />
                </TabsContent>

                <TabsContent value="candidates" className="mt-6">
                  <CandidatesList />
                </TabsContent>

                <TabsContent value="stats" className="mt-6">
                  <DepartmentStats />
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Right Column - 3D Visualization and Actions */}
          <div className="space-y-6">
            {/* 3D Pipeline Visualization */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Pipeline de recrutement</h3>
              <div className="h-[300px]">
                <RecruitmentPipeline3D />
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Planifier un entretien
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Valider une candidature
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <XCircle className="h-4 w-4 mr-2 text-red-600" />
                  Refuser une candidature
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <AlertCircle className="h-4 w-4 mr-2 text-yellow-600" />
                  Demander plus d'infos
                </Button>
              </div>
            </Card>

            {/* Upcoming Interviews */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Prochains entretiens</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Jean Martin</p>
                    <p className="text-xs text-muted-foreground">Développeur Full Stack</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">14:00</p>
                    <p className="text-xs text-muted-foreground">Aujourd'hui</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Marie Dubois</p>
                    <p className="text-xs text-muted-foreground">DevOps Engineer</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">10:30</p>
                    <p className="text-xs text-muted-foreground">Demain</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Pierre Durand</p>
                    <p className="text-xs text-muted-foreground">Data Scientist</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">15:00</p>
                    <p className="text-xs text-muted-foreground">Lun. 25</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}