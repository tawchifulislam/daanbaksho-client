'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Bell, ChevronRight } from 'lucide-react';

import { axiosSecure } from '@/lib/axios-secure';

export default function NotificationPopup({ email, open, onClose }) {
  const router = useRouter();
  const popupRef = useRef(null);

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', email],
    enabled: !!email && open,
    queryFn: async () => {
      const res = await axiosSecure.get(`/notifications/${email}`);
      return res.data;
    },
  });

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = e => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={popupRef}
      className="absolute right-4 top-16 w-80 sm:w-96 max-h-112 overflow-hidden rounded-2xl border bg-card shadow-2xl shadow-black/10 z-50 flex flex-col"
    >
      <div className="px-4 py-3 border-b flex items-center gap-2 shrink-0">
        <Bell className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-sm">Notifications</h3>
        {notifications.length > 0 && (
          <span className="ml-auto text-xs text-muted-foreground">
            {notifications.length}
          </span>
        )}
      </div>

      <div className="overflow-y-auto flex-1">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              You&apos;re all caught up.
            </p>
          </div>
        ) : (
          <ul className="divide-y">
            {notifications.map(n => (
              <li
                key={n._id}
                className="group px-4 py-3 text-sm hover:bg-muted/60 cursor-pointer transition-colors flex items-start gap-2"
                onClick={() => {
                  onClose();
                  router.push(n.actionRoute);
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="leading-snug">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(n.time).toLocaleString()}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
