'use client';

import { useApplications } from '@/src/hooks/useApplications';
import { useJobs } from '@/src/hooks/useJobs';
import { Card } from '@/components/ui/card';

export default function DebugPage() {
  const { data: applications, isLoading: appsLoading } = useApplications();
  const { data: jobs, isLoading: jobsLoading } = useJobs();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Debug Page</h1>
      
      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Applications Data</h2>
        {appsLoading ? (
          <p>Loading...</p>
        ) : (
          <pre className="text-xs overflow-auto">
            {JSON.stringify(applications?.slice(0, 2), null, 2)}
          </pre>
        )}
      </Card>
      
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Jobs Data</h2>
        {jobsLoading ? (
          <p>Loading...</p>
        ) : (
          <pre className="text-xs overflow-auto">
            {JSON.stringify(jobs?.slice(0, 2), null, 2)}
          </pre>
        )}
      </Card>
    </div>
  );
}