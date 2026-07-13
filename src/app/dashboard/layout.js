'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserRole } from '@/hooks/useUserRole';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { session, isLoading } = useUserRole();

  useEffect(() => {
    // Wait until the session check is fully resolved before deciding.
    // This is what prevents "reload -> bounced to login" false redirects.
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
    // Briefly renders nothing while the redirect above kicks in
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar and Topbar will be added */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
