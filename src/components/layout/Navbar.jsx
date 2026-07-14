'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Menu } from 'lucide-react';

import { authClient } from '@/lib/auth-client';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

function NavLinks({ session, isLoading, credits, onLogout, onNavigate }) {
  return (
    <>
      <Link
        href="/campaigns"
        onClick={onNavigate}
        className="text-sm hover:underline"
      >
        Explore Campaigns
      </Link>

      {!isLoading && session?.user ? (
        <>
          <Link
            href="/dashboard"
            onClick={onNavigate}
            className="text-sm hover:underline"
          >
            Dashboard
          </Link>
          <span className="text-sm font-medium">{credits} Credits</span>
          <Button variant="outline" size="sm" onClick={onLogout}>
            Logout
          </Button>
        </>
      ) : (
        <>
          <Link href="/login" onClick={onNavigate}>
            <Button variant="ghost" size="sm" className="w-full">
              Login
            </Button>
          </Link>
          <Link href="/register" onClick={onNavigate}>
            <Button size="sm" className="w-full">
              Register
            </Button>
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
    </>
  );
}

export default function Navbar() {
  const router = useRouter();
  const { session, credits, isLoading } = useUserRole();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
    localStorage.removeItem('access-token');
    toast.success('Logged out successfully');
    setOpen(false);
    router.push('/');
  };

  return (
    <nav className="border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          DaanBaksho
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          <NavLinks
            session={session}
            isLoading={isLoading}
            credits={credits}
            onLogout={handleLogout}
          />
        </div>

        {/* Mobile nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md h-9 w-9 hover:bg-muted transition-colors">
            <Menu className="w-5 h-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle>DaanBaksho</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 px-4 pb-6">
              <NavLinks
                session={session}
                isLoading={isLoading}
                credits={credits}
                onLogout={handleLogout}
                onNavigate={() => setOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
