'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import Image from 'next/image';
import { useUserRole } from '@/hooks/useUserRole';
import MobileSidebar from './MobileSidebar';
import NotificationPopup from './NotificationPopup';

export default function DashboardTopbar() {
  const { session, role, credits } = useUserRole();
  const [showNotifications, setShowNotifications] = useState(false);
  const email = session?.user?.email;

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-4 md:px-6 relative">
      <div className="flex items-center gap-2">
        <MobileSidebar />
        <span className="md:hidden font-bold">DaanBaksho</span>
      </div>

      <div className="flex items-center gap-3 md:gap-4 ml-auto">
        <span className="text-sm font-medium hidden sm:inline">
          {credits} Credits
        </span>

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

      <NotificationPopup
        email={email}
        open={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </header>
  );
}
