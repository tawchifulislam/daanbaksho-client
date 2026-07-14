'use client';

import { useQuery } from '@tanstack/react-query';
import { useUserRole } from '@/hooks/useUserRole';
import { axiosSecure } from '@/lib/axios-secure';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Credits Withdrawn</TableHead>
                <TableHead>Amount ($)</TableHead>
                <TableHead>Payment System</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawalsLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : withdrawals.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground"
                  >
                    No withdrawal history yet.
                  </TableCell>
                </TableRow>
              ) : (
                withdrawals.map(w => (
                  <TableRow key={w._id}>
                    <TableCell>
                      {new Date(w.withdraw_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{w.withdrawal_credit}</TableCell>
                    <TableCell>${w.withdrawal_amount}</TableCell>
                    <TableCell className="capitalize">
                      {w.payment_system}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          w.status === 'approved' ? 'default' : 'secondary'
                        }
                        className="capitalize"
                      >
                        {w.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Payment History</h1>
      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Credits Purchased</TableHead>
              <TableHead>Amount Paid ($)</TableHead>
              <TableHead>Transaction ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paymentsLoading ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  No payment history yet.
                </TableCell>
              </TableRow>
            ) : (
              payments.map(p => (
                <TableRow key={p._id}>
                  <TableCell>
                    {new Date(p.payment_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{p.credits_purchased}</TableCell>
                  <TableCell>${p.amount_paid}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {p.transaction_id}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
