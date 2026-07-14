import ManageCampaignsTable from '@/components/dashboard/admin/ManageCampaignsTable';

export default function ManageCampaignsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Campaigns</h1>
      <ManageCampaignsTable />
    </div>
  );
}
