'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiClient } from '@/src/services/api';

export default function TestAPIPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (endpoint: string, method: string = 'GET', data?: any) => {
    setLoading(true);
    try {
      const response = await apiClient.request({
        method,
        url: endpoint,
        data
      });
      
      setResults(prev => ({
        ...prev,
        [endpoint]: {
          status: 'success',
          data: response.data,
          statusCode: response.status
        }
      }));
    } catch (error: any) {
      setResults(prev => ({
        ...prev,
        [endpoint]: {
          status: 'error',
          error: error.response?.data || error.message,
          statusCode: error.response?.status
        }
      }));
    }
    setLoading(false);
  };

  const testLogin = async () => {
    await testEndpoint('/auth/login', 'POST', {
      username: 'admin_rh',
      password: 'password123'
    });
  };

  const testDirect = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'admin_rh',
          password: 'password123'
        })
      });
      
      const data = await response.json();
      
      setResults(prev => ({
        ...prev,
        'direct-fetch': {
          status: response.ok ? 'success' : 'error',
          data: data,
          statusCode: response.status
        }
      }));
    } catch (error: any) {
      setResults(prev => ({
        ...prev,
        'direct-fetch': {
          status: 'error',
          error: error.message
        }
      }));
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Test de connexion API</h1>
      
      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Configuration actuelle</h2>
        <div className="space-y-2 text-sm">
          <p><strong>API Base URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}</p>
          <p><strong>Frontend:</strong> http://localhost:3000</p>
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Tests disponibles</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={() => testEndpoint('/departments')} disabled={loading}>
              Test GET /departments
            </Button>
            <Button onClick={() => testEndpoint('/jobs')} disabled={loading}>
              Test GET /jobs
            </Button>
            <Button onClick={testLogin} disabled={loading}>
              Test POST /auth/login
            </Button>
            <Button onClick={testDirect} disabled={loading} variant="secondary">
              Test Direct Fetch
            </Button>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {Object.entries(results).map(([endpoint, result]: [string, any]) => (
          <Card key={endpoint} className="p-4">
            <h3 className="font-semibold mb-2">{endpoint}</h3>
            {result.status === 'success' ? (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription>
                  <strong>Status:</strong> {result.statusCode}<br />
                  <strong>Response:</strong>
                  <pre className="mt-2 text-xs overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertDescription>
                  <strong>Status:</strong> {result.statusCode || 'Error'}<br />
                  <strong>Error:</strong> {JSON.stringify(result.error)}
                </AlertDescription>
              </Alert>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}