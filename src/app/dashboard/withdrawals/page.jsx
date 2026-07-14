import WithdrawalForm from '@/components/dashboard/creator/WithdrawalForm';

export default function WithdrawalsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Withdrawals</h1>
      <WithdrawalForm />
    </div>
  );
}
