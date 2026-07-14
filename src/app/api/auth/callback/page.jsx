'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace('/login');
      return;
    }

    (async () => {
      const tokenRes = await fetch('/api/token');
      const tokenData = await tokenRes.json();
      if (tokenData?.token) {
        localStorage.setItem('access-token', tokenData.token);
      }

      const role = session.user.role;
      if (role === 'admin') router.replace('/dashboard/admin-home');
      else if (role === 'creator') router.replace('/dashboard/creator-home');
      else router.replace('/dashboard/supporter-home');
    })();
  }, [isPending, session, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Signing you in...</p>
    </div>
  );
}
