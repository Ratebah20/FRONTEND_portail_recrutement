'use client';

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Target,
  Users,
  Clock,
  BarChart
} from 'lucide-react';

interface StatCard {
  title: string;
  value: string | number;
  change?: number;
  target?: number;
  icon: React.ReactNode;
  color: string;
}

export function DepartmentStats() {
  const stats: StatCard[] = [
    {
      title: 'Taux d\'acceptation',
      value: '68%',
      change: 5,
      target: 75,
      icon: <Target className="h-5 w-5" />,
      color: 'text-blue-600'
    },
    {
      title: 'Temps moyen de recrutement',
      value: '23 jours',
      change: -3,
      target: 20,
      icon: <Clock className="h-5 w-5" />,
      color: 'text-purple-600'
    },
    {
      title: 'Candidats par poste',
      value: '12.5',
      change: 2,
      icon: <Users className="h-5 w-5" />,
      color: 'text-green-600'
    },
    {
      title: 'Score moyen des candidats',
      value: '76%',
      change: 8,
      icon: <BarChart className="h-5 w-5" />,
      color: 'text-orange-600'
    }
  ];

  const monthlyData = [
    { month: 'Jan', applications: 45, hires: 3 },
    { month: 'Fév', applications: 52, hires: 4 },
    { month: 'Mar', applications: 48, hires: 3 },
    { month: 'Avr', applications: 61, hires: 5 },
    { month: 'Mai', applications: 58, hires: 4 },
    { month: 'Juin', applications: 65, hires: 6 }
  ];

  const maxApplications = Math.max(...monthlyData.map(d => d.applications));

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                {stat.change !== undefined && (
                  <div className="flex items-center gap-1 mt-2">
                    {stat.change > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(stat.change)}% vs mois dernier
                    </span>
                  </div>
                )}
                {stat.target && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Objectif</span>
                      <span className="font-medium">{stat.target}%</span>
                    </div>
                    <Progress 
                      value={(parseFloat(stat.value.toString()) / stat.target) * 100} 
                      className="h-2"
                    />
                  </div>
                )}
              </div>
              <div className={`${stat.color} opacity-20`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Monthly Trend */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Évolution mensuelle</h3>
        <div className="space-y-4">
          {monthlyData.map((data, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium w-12">{data.month}</span>
                <div className="flex-1 mx-4">
                  <div className="relative">
                    <div className="h-6 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary/20 rounded-full"
                        style={{ width: `${(data.applications / maxApplications) * 100}%` }}
                      >
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(data.hires / data.applications) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground">{data.applications} candidatures</span>
                  <span className="mx-2">·</span>
                  <span className="font-medium">{data.hires} embauches</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary/20 rounded" />
            <span className="text-muted-foreground">Candidatures</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded" />
            <span className="text-muted-foreground">Embauches</span>
          </div>
        </div>
      </Card>

      {/* Performance Summary */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
        <h3 className="text-lg font-semibold mb-2">Performance du département</h3>
        <p className="text-muted-foreground mb-4">
          Votre département performe 15% mieux que la moyenne de l'entreprise
        </p>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">A+</p>
            <p className="text-sm text-muted-foreground">Note globale</p>
          </div>
          <div>
            <p className="text-2xl font-bold">3ème</p>
            <p className="text-sm text-muted-foreground">Sur 12 départements</p>
          </div>
          <div>
            <p className="text-2xl font-bold">94%</p>
            <p className="text-sm text-muted-foreground">Satisfaction candidats</p>
          </div>
        </div>
      </Card>
    </div>
  );
}