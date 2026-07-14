'use client';

import { useQuery } from '@tanstack/react-query';
import { useUserRole } from '@/hooks/useUserRole';
import { axiosSecure } from '@/lib/axios-secure';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Total Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.totalCampaigns ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Active Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.activeCampaigns ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Total Raised
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.totalRaised ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Contributions To Review</h2>
        <ContributionsToReview />
      </div>
    </div>
  );
}
