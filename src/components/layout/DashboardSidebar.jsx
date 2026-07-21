'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserRole } from '@/hooks/useUserRole';
import { navByRole } from '@/lib/dashboardNav';
import Logo from './Logo';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { role } = useUserRole();
  const links = navByRole[role] || [];

  return (
    <aside className="w-64 shrink-0 border-r bg-background hidden md:flex md:flex-col">
      <div className="h-16 flex items-center px-6 border-b">
        <Logo size="sm" />
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(link => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
