'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { axiosSecure } from '@/lib/axios-secure';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function WithdrawalRequestsTable() {
  const queryClient = useQueryClient();

  const { data: withdrawals = [], isLoading } = useQuery({
    queryKey: ['pending-withdrawals'],
    queryFn: async () => {
      const res = await axiosSecure.get('/withdrawals', {
        params: { status: 'pending' },
      });
      return res.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async id => axiosSecure.patch(`/withdrawals/${id}/approve`),
    onSuccess: () => {
      toast.success('Withdrawal marked as paid');
      queryClient.invalidateQueries({ queryKey: ['pending-withdrawals'] });
    },
    onError: () => toast.error('Failed to approve withdrawal'),
  });

  if (isLoading)
    return (
      <p className="text-muted-foreground">Loading withdrawal requests...</p>
    );

  return (
    <div className="rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Creator</TableHead>
            <TableHead>Credits</TableHead>
            <TableHead>Amount ($)</TableHead>
            <TableHead>Payment System</TableHead>
            <TableHead>Account</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {withdrawals.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                No pending withdrawal requests.
              </TableCell>
            </TableRow>
          ) : (
            withdrawals.map(w => (
              <TableRow key={w._id}>
                <TableCell className="font-medium">{w.creator_name}</TableCell>
                <TableCell>{w.withdrawal_credit}</TableCell>
                <TableCell>${w.withdrawal_amount}</TableCell>
                <TableCell className="capitalize">{w.payment_system}</TableCell>
                <TableCell>{w.account_number}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    onClick={() => approveMutation.mutate(w._id)}
                    disabled={approveMutation.isPending}
                  >
                    Payment Success
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
