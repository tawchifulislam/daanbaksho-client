import MyCampaignsTable from '@/components/dashboard/creator/MyCampaignsTable';

export default function MyCampaignsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Campaigns</h1>
      <MyCampaignsTable />
    </div>
  );
}
