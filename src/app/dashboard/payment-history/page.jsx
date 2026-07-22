'use client';

import { useQuery } from '@tanstack/react-query';
import { useUserRole } from '@/hooks/useUserRole';
import { axiosSecure } from '@/lib/axios-secure';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function PaymentHistoryPage() {
  const { session, role } = useUserRole();
  const email = session?.user?.email;

  const { data: withdrawals = [], isLoading: withdrawalsLoading } = useQuery({
    queryKey: ['creator-withdrawals', email],
    enabled: !!email && role === 'creator',
    queryFn: async () => {
      const res = await axiosSecure.get(`/withdrawals/creator/${email}`);
      return res.data;
    },
  });

  const { data: paymentsData, isLoading: paymentsLoading } = useQuery({
    queryKey: ['supporter-payments', email],
    enabled: !!email && role === 'supporter',
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments/supporter/${email}`);
      return res.data;
    },
  });

  const payments = paymentsData?.payments ?? [];

  if (role === 'creator') {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Payment History</h1>

        {withdrawalsLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : withdrawals.length === 0 ? (
          <Card className="border-none shadow-sm">
            <CardContent className="p-10 text-center text-muted-foreground">
              No withdrawal history yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {withdrawals.map(w => (
              <Card key={w._id} className="border-none shadow-sm">
                <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-medium">
                      {w.withdrawal_credit} credits → ${w.withdrawal_amount}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {w.payment_system} ·{' '}
                      {new Date(w.withdraw_date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant={w.status === 'approved' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {w.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Payment History</h1>

      {paymentsLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : payments.length === 0 ? (
        <Card className="border-none shadow-sm">
          <CardContent className="p-10 text-center text-muted-foreground">
            No payment history yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {payments.map(p => (
            <Card key={p._id} className="border-none shadow-sm">
              <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-medium">
                    {p.credits_purchased} credits — ${p.amount_paid}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(p.payment_date).toLocaleDateString()} ·{' '}
                    {p.transaction_id}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
