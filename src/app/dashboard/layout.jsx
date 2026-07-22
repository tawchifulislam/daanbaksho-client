'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserRole } from '@/hooks/useUserRole';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import DashboardTopbar from '@/components/layout/DashboardTopbar';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { session, isLoading } = useUserRole();

  useEffect(() => {
    if (!isLoading && !session?.user) {
      router.replace('/login');
    }
  }, [isLoading, session, router]);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="flex">
      <DashboardSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <DashboardTopbar />
        <main className="flex-1 bg-muted/20 overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
