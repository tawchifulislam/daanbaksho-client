'use client';

import { useQuery } from '@tanstack/react-query';
import { Users, Handshake, Coins, Receipt } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { axiosSecure } from '@/lib/axios-secure';
import StatCard from '@/components/dashboard/StatCard';
import CampaignApprovalsTable from '@/components/dashboard/admin/CampaignApprovalsTable';

export default function AdminHomePage() {
  const { session } = useUserRole();

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin-stats');
      return res.data;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {session?.user?.name}</h1>
        <p className="text-muted-foreground mt-1">Admin control panel.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Supporters"
          value={stats?.totalSupporters ?? 0}
          accent="primary"
        />
        <StatCard
          icon={Handshake}
          label="Total Creators"
          value={stats?.totalCreators ?? 0}
          accent="brand"
        />
        <StatCard
          icon={Coins}
          label="Total Available Credits"
          value={stats?.totalCredits ?? 0}
          accent="primary"
        />
        <StatCard
          icon={Receipt}
          label="Total Payments"
          value={stats?.totalPayments ?? 0}
          accent="brand"
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">
          Campaigns Pending Approval
        </h2>
        <CampaignApprovalsTable />
      </div>
    </div>
  );
}
