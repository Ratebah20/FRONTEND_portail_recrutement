'use client';

import { useEffect } from 'react';

export function APIDebug() {
  useEffect(() => {
    // Intercepter toutes les requêtes fetch
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      console.log('🚀 API Request:', {
        url: args[0],
        options: args[1]
      });
      
      try {
        const response = await originalFetch(...args);
        const clonedResponse = response.clone();
        
        console.log('✅ API Response:', {
          url: args[0],
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        });
        
        // Log du body si c'est du JSON
        if (response.headers.get('content-type')?.includes('application/json')) {
          const body = await clonedResponse.json();
          console.log('📦 Response Body:', body);
        }
        
        return response;
      } catch (error) {
        console.error('❌ API Error:', error);
        throw error;
      }
    };
    
    return () => {
      window.fetch = originalFetch;
    };
  }, []);
  
  return null;
}