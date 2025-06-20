'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuthStore } from '@/src/stores/authStore';
import { AnimatedText } from '@/src/components/animations/AnimatedText';
import { Logo3D } from '@/src/components/3d/Logo3D';
import { User, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user } = useAuthStore();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Rediriger si déjà connecté
    if (isAuthenticated && user) {
      const redirectPath = user.role === 'manager' ? '/manager' : '/hr';
      router.push(redirectPath);
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData.username, formData.password);
      // La redirection sera gérée par le useEffect une fois que user est mis à jour
    } catch (err) {
      setError('Nom d\'utilisateur ou mot de passe incorrect');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md space-y-8 px-4">
        {/* Logo 3D */}
        <div className="flex justify-center">
          <Logo3D />
        </div>

        {/* Titre */}
        <div className="text-center">
          <AnimatedText
            text="Portail de Recrutement IA"
            className="text-3xl font-bold text-gray-900 dark:text-white"
            animation="slideUp"
          />
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Connectez-vous pour accéder au tableau de bord
          </p>
        </div>

        {/* Formulaire */}
        <Card className="p-8 backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="pl-10"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          {/* Info de démonstration */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Comptes de démonstration :</strong><br />
              RH : admin_rh / password123 → <span className="text-xs">/hr</span><br />
              Manager : manager_it / password123 → <span className="text-xs">/manager</span>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}