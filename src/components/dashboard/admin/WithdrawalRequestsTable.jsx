'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CheckCircle2 } from 'lucide-react';

import { axiosSecure } from '@/lib/axios-secure';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

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

  if (withdrawals.length === 0) {
    return (
      <Card className="border-none shadow-sm">
        <CardContent className="p-10 text-center text-muted-foreground">
          No pending withdrawal requests.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {withdrawals.map(w => (
        <Card key={w._id} className="border-none shadow-sm">
          <CardContent className="p-4 flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <p className="font-medium">{w.creator_name}</p>
              <p className="text-sm text-muted-foreground">
                {w.withdrawal_credit} credits →{' '}
                <span className="font-medium text-primary">
                  ${w.withdrawal_amount}
                </span>
              </p>
              <p className="text-sm text-muted-foreground capitalize">
                {w.payment_system} · {w.account_number}
              </p>
            </div>

            <Button
              size="sm"
              onClick={() => approveMutation.mutate(w._id)}
              disabled={approveMutation.isPending}
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
              Payment Success
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
