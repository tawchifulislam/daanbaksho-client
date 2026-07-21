'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { Menu, Coins, LogOut } from 'lucide-react';
import { LogoGithub } from '@gravity-ui/icons';

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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Logo from './Logo';
import Container from './Container';

const GITHUB_CLIENT_REPO =
  'https://github.com/tawchifulislam/daanbaksho-client';

function CreditsBadge({ credits }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1.5 text-sm font-medium">
      <Coins className="w-3.5 h-3.5" />
      {credits}
    </span>
  );
}

function UserMenu({ session, onLogout }) {
  const initials = session.user.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar className="w-9 h-9 border">
          <AvatarImage src={session.user.image} alt={session.user.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <p className="font-medium truncate">{session.user.name}</p>
            <p className="text-xs text-muted-foreground font-normal truncate">
              {session.user.email}
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onLogout}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DeveloperLink() {
  return (
    <a
      href={GITHUB_CLIENT_REPO}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
    >
      <LogoGithub className="w-4 h-4" />
      Join as Developer
    </a>
  );
}

function CenterNavLinks({ pathname, showDashboard }) {
  const isExploreActive = pathname === '/campaigns';
  const isDashboardActive = pathname?.startsWith('/dashboard');

  return (
    <>
      <Link
        href="/campaigns"
        className={`text-sm font-medium transition-colors ${
          isExploreActive ? 'text-primary' : 'hover:text-primary'
        }`}
      >
        Explore Campaigns
      </Link>

      {showDashboard && (
        <Link
          href="/dashboard"
          className={`text-sm font-medium transition-colors ${
            isDashboardActive ? 'text-primary' : 'hover:text-primary'
          }`}
        >
          Dashboard
        </Link>
      )}

      <DeveloperLink />
    </>
  );
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { session, credits, isLoading } = useUserRole();
  const [open, setOpen] = useState(false);

  const isLoggedIn = !isLoading && !!session?.user;

  const handleLogout = async () => {
    await authClient.signOut();
    localStorage.removeItem('access-token');
    toast.success('Logged out successfully');
    setOpen(false);
    router.push('/');
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 sticky top-0 z-40">
      <Container className="h-16 grid grid-cols-2 lg:grid-cols-3 items-center">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Center: nav links — desktop only */}
        <div className="hidden lg:flex items-center justify-center gap-6">
          <CenterNavLinks pathname={pathname} showDashboard={isLoggedIn} />
        </div>

        {/* Right: credits + auth/profile (desktop) or hamburger (mobile/tablet) */}
        <div className="flex items-center justify-end gap-3">
          {isLoggedIn ? (
            <>
              <div className="hidden lg:flex items-center gap-3">
                <CreditsBadge credits={credits} />
                <UserMenu session={session} onLogout={handleLogout} />
              </div>
            </>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}

          {/* Mobile / tablet trigger — only element shown below lg */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="lg:hidden inline-flex items-center justify-center rounded-md h-9 w-9 hover:bg-muted transition-colors">
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>
                  <Logo withLink={false} size="sm" />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col items-start gap-4 px-4 pb-6">
                {isLoggedIn && (
                  <div className="flex items-center justify-between gap-3 pb-3 border-b w-full">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="w-9 h-9 border">
                        <AvatarImage
                          src={session.user.image}
                          alt={session.user.name}
                        />
                        <AvatarFallback>
                          {session.user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                    <CreditsBadge credits={credits} />
                  </div>
                )}

                <Link
                  href="/campaigns"
                  onClick={() => setOpen(false)}
                  className={`text-sm font-medium ${pathname === '/campaigns' ? 'text-primary' : ''}`}
                >
                  Explore Campaigns
                </Link>

                {isLoggedIn && (
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className={`text-sm font-medium ${pathname?.startsWith('/dashboard') ? 'text-primary' : ''}`}
                  >
                    Dashboard
                  </Link>
                )}

                <DeveloperLink />

                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                ) : (
                  <div className="flex flex-col gap-2 w-full">
                    <Link href="/login" onClick={() => setOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setOpen(false)}>
                      <Button size="sm" className="w-full">
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </nav>
  );
}
