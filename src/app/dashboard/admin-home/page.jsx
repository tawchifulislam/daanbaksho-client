'use client';

import { useUserRole } from '@/hooks/useUserRole';

export default function AdminHomePage() {
  const { session } = useUserRole();

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome, {session?.user?.name}</h1>
      <p className="text-muted-foreground mt-1">Admin control panel.</p>
    </div>
  );
}
