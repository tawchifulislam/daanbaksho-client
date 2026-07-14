'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import Image from 'next/image';
import { useUserRole } from '@/hooks/useUserRole';

export default function DashboardTopbar() {
  const { session, role, credits } = useUserRole();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-4 md:px-6 relative">
      <div className="md:hidden font-bold">DaanBaksho</div>

      <div className="flex items-center gap-4 ml-auto">
        <span className="text-sm font-medium">{credits} Credits</span>

        <button
          onClick={() => setShowNotifications(prev => !prev)}
          className="relative p-2 rounded-full hover:bg-muted"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {session?.user?.image && (
            <Image
              src={session.user.image}
              alt={session.user.name || 'User'}
              width={36}
              height={36}
              className="rounded-full object-cover"
            />
          )}
          <div className="hidden sm:block text-sm">
            <p className="font-medium leading-none">{session?.user?.name}</p>
            <p className="text-muted-foreground capitalize text-xs mt-0.5">
              {role}
            </p>
          </div>
        </div>
      </div>

      {/* Notification popup placeholder — wired to real data in Phase 10 */}
      {showNotifications && (
        <div
          className="absolute right-4 top-16 w-80 rounded-lg border bg-background shadow-lg p-4 z-50"
          onClick={e => e.stopPropagation()}
        >
          <p className="text-sm text-muted-foreground">
            No notifications yet — this will be wired up in a later phase.
          </p>
        </div>
      )}
    </header>
  );
}
