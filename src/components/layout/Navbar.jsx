'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';

import { authClient } from '@/lib/auth-client';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const router = useRouter();
  const { session, credits, isLoading } = useUserRole();

  const handleLogout = async () => {
    await authClient.signOut();
    localStorage.removeItem('access-token');
    toast.success('Logged out successfully');
    router.push('/');
  };

  return (
    <nav className="border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          DaanBaksho
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/campaigns" className="text-sm hover:underline">
            Explore Campaigns
          </Link>

          {!isLoading && session?.user ? (
            <>
              <Link href="/dashboard" className="text-sm hover:underline">
                Dashboard
              </Link>
              <span className="text-sm font-medium">{credits} Credits</span>
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'User avatar'}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}

          <a
            href="https://github.com/YOUR_USERNAME/daanbaksho-client"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:underline"
          >
            Join as Developer
          </a>
        </div>
      </div>
    </nav>
  );
}
