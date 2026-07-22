'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserRole } from '@/hooks/useUserRole';
import Loading from '@/components/ui/Loading';

export default function DashboardIndexPage() {
  const router = useRouter();
  const { role, isLoading } = useUserRole();

  useEffect(() => {
    if (isLoading) return;

    if (role === 'admin') router.replace('/dashboard/admin-home');
    else if (role === 'creator') router.replace('/dashboard/creator-home');
    else if (role === 'supporter') router.replace('/dashboard/supporter-home');
  }, [isLoading, role, router]);

  return (
    <div className="flex items-center justify-center h-full py-20">
      <Loading label="Redirecting to dashboard" />
    </div>
  );
}
