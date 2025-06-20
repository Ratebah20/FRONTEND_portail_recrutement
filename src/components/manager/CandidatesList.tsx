'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  ChevronRight, 
  Calendar,
  FileText,
  Brain,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Candidate {
  id: number;
  name: string;
  position: string;
  appliedDate: Date;
  status: 'interview_scheduled' | 'pending_review' | 'pending_decision';
  aiScore?: number;
  interviewDate?: Date;
  priority: 'high' | 'medium' | 'low';
}

// Données de démonstration
const mockCandidates: Candidate[] = [
  {
    id: 1,
    name: 'Sophie Bernard',
    position: 'Senior Developer',
    appliedDate: new Date(Date.now() - 5 * 86400000),
    status: 'pending_decision',
    aiScore: 85,
    interviewDate: new Date(Date.now() - 86400000),
    priority: 'high'
  },
  {
    id: 2,
    name: 'Lucas Petit',
    position: 'DevOps Engineer',
    appliedDate: new Date(Date.now() - 3 * 86400000),
    status: 'interview_scheduled',
    aiScore: 78,
    interviewDate: new Date(Date.now() + 2 * 86400000),
    priority: 'medium'
  },
  {
    id: 3,
    name: 'Emma Rousseau',
    position: 'Data Analyst',
    appliedDate: new Date(Date.now() - 7 * 86400000),
    status: 'pending_review',
    aiScore: 92,
    priority: 'high'
  },
  {
    id: 4,
    name: 'Thomas Garcia',
    position: 'Full Stack Developer',
    appliedDate: new Date(Date.now() - 2 * 86400000),
    status: 'pending_decision',
    aiScore: 74,
    interviewDate: new Date(Date.now() - 2 * 86400000),
    priority: 'medium'
  }
];

export function CandidatesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredCandidates = mockCandidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || candidate.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'interview_scheduled':
        return <Calendar className="h-4 w-4" />;
      case 'pending_review':
        return <FileText className="h-4 w-4" />;
      case 'pending_decision':
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'interview_scheduled':
        return 'Entretien planifié';
      case 'pending_review':
        return 'En cours d\'examen';
      case 'pending_decision':
        return 'En attente de décision';
      default:
        return '';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher un candidat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('all')}
          >
            Tous
          </Button>
          <Button
            variant={filterStatus === 'pending_decision' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('pending_decision')}
          >
            Décision
          </Button>
          <Button
            variant={filterStatus === 'interview_scheduled' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('interview_scheduled')}
          >
            Entretien
          </Button>
          <Button
            variant={filterStatus === 'pending_review' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('pending_review')}
          >
            Examen
          </Button>
        </div>
      </div>

      {/* Candidates List */}
      <div className="space-y-3">
        {filteredCandidates.map(candidate => (
          <Card key={candidate.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-medium">{candidate.name}</h4>
                  <Badge variant="outline" className={`text-xs ${getPriorityColor(candidate.priority)}`}>
                    {candidate.priority === 'high' ? 'Priorité haute' :
                     candidate.priority === 'medium' ? 'Priorité moyenne' : 'Priorité basse'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{candidate.position}</p>
                
                <div className="flex items-center gap-4 mt-3">
                  <span className="flex items-center gap-1 text-sm">
                    {getStatusIcon(candidate.status)}
                    {getStatusLabel(candidate.status)}
                  </span>
                  
                  {candidate.aiScore && (
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-muted-foreground" />
                      <Progress value={candidate.aiScore} className="w-20 h-2" />
                      <span className="text-sm font-medium">{candidate.aiScore}%</span>
                    </div>
                  )}
                  
                  {candidate.interviewDate && (
                    <span className="text-sm text-muted-foreground">
                      Entretien: {candidate.interviewDate.toLocaleDateString('fr-FR')}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {candidate.status === 'pending_decision' && (
                  <>
                    <Button size="sm" variant="outline" className="text-green-600">
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600">
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <Button size="sm" variant="ghost">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredCandidates.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Aucun candidat trouvé</p>
        </div>
      )}
    </div>
  );
}