'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/lib/auth-client';
import { axiosSecure } from '@/lib/axios-secure';

export function useUserRole() {
  const { data: session, isPending: sessionLoading } = useSession();
  const email = session?.user?.email;

  const { data: userInfo, isLoading: userInfoLoading } = useQuery({
    queryKey: ['user-info', email],
    enabled: !!email,
    retry: false,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${email}`);
      return res.data;
    },
  });

  return {
    session,
    userInfo,
    role: userInfo?.role,
    credits: userInfo?.credits ?? 0,
    isLoading: sessionLoading || (!!email && userInfoLoading),
  };
}
