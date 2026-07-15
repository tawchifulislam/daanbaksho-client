'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

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
      className="absolute right-4 top-16 w-72 sm:w-80 max-h-96 overflow-y-auto rounded-lg border bg-background shadow-lg z-50"
    >
      {notifications.length === 0 ? (
        <p className="p-4 text-sm text-muted-foreground">
          No notifications yet.
        </p>
      ) : (
        <ul className="divide-y">
          {notifications.map(n => (
            <li
              key={n._id}
              className="p-3 text-sm hover:bg-muted cursor-pointer"
              onClick={() => {
                onClose();
                router.push(n.actionRoute);
              }}
            >
              <p>{n.message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(n.time).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
