'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/src/stores/authStore';
import { usePathname, useRouter } from 'next/navigation';

const PUBLIC_ROUTES = ['/login', '/test-api', '/test-3d', '/debug'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkAuth, isLoading, isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Vérifier l'authentification au chargement
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Rediriger vers login si non authentifié et pas sur une route publique
    if (!isLoading && !isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  // Afficher un loader pendant la vérification
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}