// Utilitaires pour gérer les JWT

interface JWTPayload {
  exp: number;
  sub: string;
  username: string;
  email: string;
  role_id: number;
  is_hr: boolean;
}

export function parseJWT(token: string): JWTPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = parseJWT(token);
  if (!payload) return true;
  
  // exp est en secondes, Date.now() est en millisecondes
  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now();
  
  // Ajouter une marge de 5 minutes (300000 ms) pour renouveler avant expiration
  return currentTime > expirationTime - 300000;
}

export function getTokenExpirationTime(token: string): Date | null {
  const payload = parseJWT(token);
  if (!payload) return null;
  
  return new Date(payload.exp * 1000);
}