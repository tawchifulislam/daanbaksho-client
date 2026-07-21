'use client';

import { useQuery } from '@tanstack/react-query';
import { Layers, TrendingUp, Coins } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { axiosSecure } from '@/lib/axios-secure';
import StatCard from '@/components/dashboard/StatCard';
import ContributionsToReview from '@/components/dashboard/creator/ContributionsToReview';

export default function CreatorHomePage() {
  const { session, credits } = useUserRole();
  const email = session?.user?.email;

  const { data: stats } = useQuery({
    queryKey: ['creator-stats', email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/creator-stats/${email}`);
      return res.data;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {session?.user?.name}</h1>
        <p className="text-muted-foreground mt-1">
          You currently have {credits} credits.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={Layers}
          label="Total Campaigns"
          value={stats?.totalCampaigns ?? 0}
          accent="primary"
        />
        <StatCard
          icon={TrendingUp}
          label="Active Campaigns"
          value={stats?.activeCampaigns ?? 0}
          accent="brand"
        />
        <StatCard
          icon={Coins}
          label="Total Raised"
          value={stats?.totalRaised ?? 0}
          accent="primary"
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Contributions To Review</h2>
        <ContributionsToReview />
      </div>
    </div>
  );
}
