'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserRole } from '@/hooks/useUserRole';
import {
  Home,
  Search,
  Wallet,
  CreditCard,
  History,
  PlusCircle,
  Layers,
  Users,
  ClipboardList,
  Flag,
} from 'lucide-react';

const navByRole = {
  supporter: [
    { href: '/dashboard/supporter-home', label: 'Home', icon: Home },
    {
      href: '/dashboard/explore-campaigns',
      label: 'Explore Campaigns',
      icon: Search,
    },
    {
      href: '/dashboard/my-contributions',
      label: 'My Contributions',
      icon: Wallet,
    },
    {
      href: '/dashboard/purchase-credit',
      label: 'Purchase Credit',
      icon: CreditCard,
    },
    {
      href: '/dashboard/payment-history',
      label: 'Payment History',
      icon: History,
    },
  ],
  creator: [
    { href: '/dashboard/creator-home', label: 'Home', icon: Home },
    {
      href: '/dashboard/add-campaign',
      label: 'Add New Campaign',
      icon: PlusCircle,
    },
    { href: '/dashboard/my-campaigns', label: 'My Campaigns', icon: Layers },
    { href: '/dashboard/withdrawals', label: 'Withdrawals', icon: Wallet },
    {
      href: '/dashboard/payment-history',
      label: 'Payment History',
      icon: History,
    },
  ],
  admin: [
    { href: '/dashboard/admin-home', label: 'Home', icon: Home },
    { href: '/dashboard/manage-users', label: 'Manage Users', icon: Users },
    {
      href: '/dashboard/manage-campaigns',
      label: 'Manage Campaigns',
      icon: Layers,
    },
    {
      href: '/dashboard/withdrawal-requests',
      label: 'Withdrawal Requests',
      icon: ClipboardList,
    },
    { href: '/dashboard/reports', label: 'Reports', icon: Flag },
  ],
};

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { role } = useUserRole();

  const links = navByRole[role] || [];

  return (
    <aside className="w-64 shrink-0 border-r bg-background hidden md:flex md:flex-col">
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/" className="text-lg font-bold">
          DaanBaksho
        </Link>
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
