import WithdrawalRequestsTable from '@/components/dashboard/admin/WithdrawalRequestsTable';

export default function WithdrawalRequestsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Withdrawal Requests</h1>
      <WithdrawalRequestsTable />
    </div>
  );
}
