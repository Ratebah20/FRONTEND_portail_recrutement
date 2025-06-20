'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/src/stores/authStore';
import { parseJWT, getTokenExpirationTime, isTokenExpired } from '@/src/utils/jwt';
import { useEffect, useState } from 'react';

export default function AuthInfoPage() {
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [refreshTokenInfo, setRefreshTokenInfo] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    const updateTokenInfo = () => {
      const token = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (token) {
        const parsed = parseJWT(token);
        const expiration = getTokenExpirationTime(token);
        const expired = isTokenExpired(token);
        
        setTokenInfo({
          parsed,
          expiration: expiration?.toLocaleString(),
          expired,
          raw: token.substring(0, 50) + '...'
        });
        
        // Calculer le temps restant
        if (expiration) {
          const now = new Date();
          const diff = expiration.getTime() - now.getTime();
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setTimeRemaining(diff > 0 ? `${minutes}m ${seconds}s` : 'Expiré');
        }
      }
      
      if (refreshToken) {
        const parsed = parseJWT(refreshToken);
        const expiration = getTokenExpirationTime(refreshToken);
        
        setRefreshTokenInfo({
          parsed,
          expiration: expiration?.toLocaleString(),
          raw: refreshToken.substring(0, 50) + '...'
        });
      }
    };
    
    updateTokenInfo();
    const interval = setInterval(updateTokenInfo, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Informations d'authentification</h1>
      
      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">État actuel</h2>
          <div className="space-y-2">
            <p><strong>Authentifié:</strong> {isAuthenticated ? 'Oui' : 'Non'}</p>
            <p><strong>Utilisateur:</strong> {user?.username || 'Non connecté'}</p>
            <p><strong>Email:</strong> {user?.email || '-'}</p>
            <p><strong>Rôle:</strong> {user?.is_hr ? 'RH' : 'Manager'}</p>
          </div>
          
          <Button 
            onClick={() => checkAuth()} 
            className="mt-4"
            variant="outline"
          >
            Vérifier l'authentification
          </Button>
        </Card>
        
        {tokenInfo && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Access Token</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Temps restant:</strong> <span className={tokenInfo.expired ? 'text-red-600' : 'text-green-600'}>{timeRemaining}</span></p>
              <p><strong>Expiration:</strong> {tokenInfo.expiration}</p>
              <p><strong>Expiré:</strong> {tokenInfo.expired ? 'Oui' : 'Non'}</p>
              <p><strong>Username:</strong> {tokenInfo.parsed?.username}</p>
              <p><strong>User ID:</strong> {tokenInfo.parsed?.sub}</p>
              <p><strong>Token (tronqué):</strong> <code className="text-xs">{tokenInfo.raw}</code></p>
            </div>
          </Card>
        )}
        
        {refreshTokenInfo && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Refresh Token</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Expiration:</strong> {refreshTokenInfo.expiration}</p>
              <p><strong>Token (tronqué):</strong> <code className="text-xs">{refreshTokenInfo.raw}</code></p>
            </div>
          </Card>
        )}
        
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Actions</h2>
          <div className="flex gap-4">
            <Button 
              onClick={() => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.reload();
              }}
              variant="destructive"
            >
              Supprimer les tokens
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/login'}
              variant="outline"
            >
              Aller au login
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}