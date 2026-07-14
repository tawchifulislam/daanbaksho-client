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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardTopbar />
        <main className="flex-1 p-6 bg-muted/20">{children}</main>
      </div>
    </div>
  );
}
