// Store Zustand pour l'authentification
import { create } from 'zustand';
import { isTokenExpired, parseJWT } from '@/src/utils/jwt';

interface User {
  id: number;
  username: string;
  email: string;
  role_id: number;
  department_id: number | null;
  department_name: string | null;
  is_hr: boolean;
}

interface AuthStore {
  // État
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  // État initial
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  login: async (username, password) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      if (!response.ok) throw new Error('Login failed');
      
      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      
      set({ user: data.user, isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null, isAuthenticated: false });
  },
  
  checkAuth: async () => {
    try {
      const token = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (!token) {
        set({ isLoading: false, isAuthenticated: false });
        return;
      }
      
      // Vérifier si le token est expiré
      if (isTokenExpired(token)) {
        console.log('Token expiré, tentative de refresh...');
        
        if (!refreshToken) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          set({ isLoading: false, isAuthenticated: false, user: null });
          return;
        }
        
        // Tenter de rafraîchir le token
        try {
          const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/refresh`, {
            method: 'POST',
            headers: { 
              'Authorization': `Bearer ${refreshToken}`,
              'Content-Type': 'application/json'
            },
          });
          
          if (refreshResponse.ok) {
            const data = await refreshResponse.json();
            localStorage.setItem('access_token', data.access_token);
            
            // Utiliser le nouveau token pour obtenir les infos utilisateur
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/me`, {
              headers: { Authorization: `Bearer ${data.access_token}` },
            });
            
            if (response.ok) {
              const user = await response.json();
              set({ user, isAuthenticated: true, isLoading: false });
              return;
            }
          }
        } catch (refreshError) {
          console.error('Erreur lors du refresh:', refreshError);
        }
        
        // Si le refresh échoue, déconnecter
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({ isLoading: false, isAuthenticated: false, user: null });
        return;
      }
      
      // Token valide, récupérer les infos utilisateur
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const user = await response.json();
        set({ user, isAuthenticated: true, isLoading: false });
      } else if (response.status === 401) {
        // Token invalide, nettoyer et déconnecter
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({ isLoading: false, isAuthenticated: false, user: null });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Erreur lors de la vérification auth:', error);
      set({ isLoading: false });
    }
  },
}));