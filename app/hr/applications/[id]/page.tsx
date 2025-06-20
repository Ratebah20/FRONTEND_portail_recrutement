'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/src/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AnimatedText } from '@/src/components/animations/AnimatedText';
import { SkillsSphere } from '@/src/components/3d/SkillsSphere';
import { ScoreGauge3D } from '@/src/components/3d/ScoreGauge3D';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/src/services/api';
import { Application } from '@/src/types';
import {
  Brain,
  FileText,
  Download,
  Mail,
  Phone,
  Calendar,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  User,
  Briefcase
} from 'lucide-react';

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const applicationId = Number(params.id);
  
  const { data: application, isLoading, refetch } = useQuery({
    queryKey: ['application', applicationId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/applications/${applicationId}`);
      return data as Application;
    },
    enabled: !!applicationId
  });
  
  const analyzeCV = useMutation({
    mutationFn: async () => {
      setIsAnalyzing(true);
      setAnalysisProgress(0);
      
      // Simuler la progression
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);
      
      try {
        const { data } = await apiClient.post(`/applications/${applicationId}/analyze`);
        clearInterval(progressInterval);
        setAnalysisProgress(100);
        return data;
      } finally {
        setTimeout(() => {
          setIsAnalyzing(false);
          setAnalysisProgress(0);
        }, 1000);
      }
    },
    onSuccess: () => {
      refetch();
    }
  });
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-96" />
        </div>
      </DashboardLayout>
    );
  }
  
  if (!application) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <Alert>
            <AlertDescription>Candidature non trouvée</AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }
  
  // Parser les compétences de l'analyse IA si disponible
  const parseSkills = (analysis: string | null, aiScore: number | null): any[] => {
    // Si on a un score mais pas d'analyse détaillée, générer des données de démo
    if (aiScore && !analysis) {
      return [
        { name: 'React', score: 90, category: 'Frontend' },
        { name: 'TypeScript', score: 85, category: 'Frontend' },
        { name: 'Node.js', score: 80, category: 'Backend' },
        { name: 'Python', score: 75, category: 'Backend' },
        { name: 'PostgreSQL', score: 70, category: 'Database' },
        { name: 'Docker', score: 65, category: 'DevOps' },
        { name: 'Leadership', score: 80, category: 'Soft Skills' },
        { name: 'Communication', score: 85, category: 'Soft Skills' }
      ];
    }
    
    if (!analysis) return [];
    
    // TODO: Parser l'analyse IA réelle pour extraire les compétences
    // Pour l'instant, on retourne des données de démo si on a une analyse
    return [
      { name: 'React', score: 90, category: 'Frontend' },
      { name: 'TypeScript', score: 85, category: 'Frontend' },
      { name: 'Node.js', score: 80, category: 'Backend' },
      { name: 'Python', score: 75, category: 'Backend' },
      { name: 'PostgreSQL', score: 70, category: 'Database' },
      { name: 'Docker', score: 65, category: 'DevOps' },
      { name: 'Leadership', score: 80, category: 'Soft Skills' },
      { name: 'Communication', score: 85, category: 'Soft Skills' }
    ];
  };
  
  const skills = parseSkills(application.ai_analysis, application.ai_score);
  
  const statusIcons = {
    1: Clock,      // SUBMITTED
    2: Clock,      // UNDER_REVIEW
    3: Calendar,   // INTERVIEW
    4: XCircle,    // REJECTED
    5: CheckCircle // ACCEPTED
  };
  
  const StatusIcon = statusIcons[application.status] || Clock;
  
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div>
              <AnimatedText
                text={`${application.candidate.first_name} ${application.candidate.last_name}`}
                className="text-3xl font-bold"
                animation="slideUp"
              />
              <p className="text-muted-foreground mt-1">
                Candidature pour {application.job.title}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {application.cv_filename && (
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Télécharger CV
              </Button>
            )}
            
            {!application.ai_score && (
              <Button
                onClick={() => analyzeCV.mutate()}
                disabled={isAnalyzing}
              >
                <Brain className="h-4 w-4 mr-2" />
                {isAnalyzing ? 'Analyse en cours...' : 'Analyser avec IA'}
              </Button>
            )}
          </div>
        </div>
        
        {/* Progress bar pour l'analyse */}
        {isAnalyzing && (
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <p className="font-medium">Analyse IA en cours...</p>
            </div>
            <Progress value={analysisProgress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              L'IA analyse le CV et évalue la correspondance avec le poste
            </p>
          </Card>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations du candidat */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations du candidat
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{application.candidate.email}</p>
                  </div>
                </div>
                
                {application.candidate.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Téléphone</p>
                      <p className="font-medium">{application.candidate.phone}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date de candidature</p>
                    <p className="font-medium">
                      {new Date(application.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <StatusIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Statut</p>
                    <Badge variant="outline">
                      {application.status === 1 && 'Nouvelle'}
                      {application.status === 2 && 'En cours'}
                      {application.status === 3 && 'Entretien'}
                      {application.status === 4 && 'Refusée'}
                      {application.status === 5 && 'Acceptée'}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Tabs pour CV et lettre */}
            <Card className="p-6">
              <Tabs defaultValue="cover">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="cover">Lettre de motivation</TabsTrigger>
                  <TabsTrigger value="analysis">Analyse IA</TabsTrigger>
                </TabsList>
                
                <TabsContent value="cover" className="mt-6">
                  {application.cover_letter ? (
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap">{application.cover_letter}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Aucune lettre de motivation fournie</p>
                  )}
                </TabsContent>
                
                <TabsContent value="analysis" className="mt-6">
                  {application.ai_analysis ? (
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap">{application.ai_analysis}</p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        Aucune analyse IA disponible
                      </p>
                      <Button
                        onClick={() => analyzeCV.mutate()}
                        disabled={isAnalyzing}
                        size="sm"
                      >
                        Lancer l'analyse
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </Card>
            
            {/* Visualisation des compétences */}
            {application.ai_score && skills.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Compétences détectées
                </h2>
                <div className="h-[400px]">
                  <SkillsSphere skills={skills} />
                </div>
              </Card>
            )}
          </div>
          
          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Score IA */}
            {application.ai_score && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Score IA</h3>
                <div className="h-[300px]">
                  <ScoreGauge3D score={Math.round(application.ai_score)} />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Correspondance avec le poste
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    {Math.round(application.ai_score) >= 80 && 'Excellente'}
                    {Math.round(application.ai_score) >= 60 && Math.round(application.ai_score) < 80 && 'Bonne'}
                    {Math.round(application.ai_score) < 60 && 'Moyenne'}
                  </p>
                </div>
              </Card>
            )}
            
            {/* Informations sur le poste */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Poste
              </h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Titre</p>
                  <p className="font-medium">{application.job.title}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Département</p>
                  <p className="font-medium">
                    {application.job.department_name || 'Non défini'}
                  </p>
                </div>
              </div>
            </Card>
            
            {/* Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Actions</h3>
              
              <div className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Planifier un entretien
                </Button>
                
                <Button className="w-full" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Envoyer un email
                </Button>
                
                <div className="pt-3 border-t">
                  <p className="text-sm text-muted-foreground mb-3">
                    Changer le statut
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" className="text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Accepter
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600">
                      <XCircle className="h-3 w-3 mr-1" />
                      Refuser
                    </Button>
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