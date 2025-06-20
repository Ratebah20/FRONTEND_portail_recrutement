'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AnimatedText } from '@/src/components/animations/AnimatedText';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  TrendingUp,
  FileText,
  UserCheck,
  Clock,
  CheckCircle
} from 'lucide-react';

// Données fictives pour la démo
const stats = [
  { label: 'Candidatures totales', value: 234, icon: FileText, trend: '+12%' },
  { label: 'En cours d\'examen', value: 45, icon: Clock, trend: '+5%' },
  { label: 'Entretiens planifiés', value: 18, icon: Calendar, trend: '+8%' },
  { label: 'Candidats acceptés', value: 7, icon: UserCheck, trend: '+15%' },
];

const recentApplications = [
  { id: 1, name: 'Marie Dupont', position: 'Développeur Full Stack', status: 'En cours', score: 85 },
  { id: 2, name: 'Jean Martin', position: 'Chef de Projet', status: 'Entretien', score: 78 },
  { id: 3, name: 'Sophie Bernard', position: 'Designer UX/UI', status: 'Nouveau', score: null },
  { id: 4, name: 'Pierre Durand', position: 'Data Analyst', status: 'En cours', score: 92 },
];

export default function HRDashboard() {
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
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-green-600">
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          );
        })}
      </div>

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
              {recentApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex-1">
                    <h3 className="font-medium">{app.name}</h3>
                    <p className="text-sm text-muted-foreground">{app.position}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {app.score && (
                      <div className="text-right">
                        <p className="text-sm font-medium">Score IA</p>
                        <p className="text-2xl font-bold text-primary">{app.score}%</p>
                      </div>
                    )}
                    
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      app.status === 'Nouveau' ? 'bg-blue-100 text-blue-700' :
                      app.status === 'En cours' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {app.status}
                    </div>
                  </div>
                </div>
              ))}
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