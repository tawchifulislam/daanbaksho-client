'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { withdrawalSchema } from '@/lib/validations/withdrawal';
import { axiosSecure } from '@/lib/axios-secure';
import { useUserRole } from '@/hooks/useUserRole';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function WithdrawalForm() {
  const { session } = useUserRole();
  const email = session?.user?.email;
  const queryClient = useQueryClient();

  const { data: stats } = useQuery({
    queryKey: ['creator-stats', email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/creator-stats/${email}`);
      return res.data;
    },
  });

  const { data: withdrawals = [] } = useQuery({
    queryKey: ['creator-withdrawals', email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/withdrawals/creator/${email}`);
      return res.data;
    },
  });

  const alreadyWithdrawn = withdrawals.reduce(
    (sum, w) => sum + w.withdrawal_credit,
    0,
  );
  const availableCredit = (stats?.totalRaised ?? 0) - alreadyWithdrawn;
  const availableAmount = (availableCredit / 20).toFixed(2);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: { payment_system: '' },
  });

  const creditToWithdraw = watch('withdrawal_credit');
  const paymentSystem = watch('payment_system');
  const dollarAmount = creditToWithdraw
    ? (Number(creditToWithdraw) / 20).toFixed(2)
    : '0.00';

  const withdrawMutation = useMutation({
    mutationFn: async values => {
      return axiosSecure.post('/withdrawals', {
        ...values,
        creator_email: session.user.email,
        creator_name: session.user.name,
      });
    },
    onSuccess: () => {
      toast.success('Withdrawal request submitted');
      reset();
      queryClient.invalidateQueries({
        queryKey: ['creator-withdrawals', email],
      });
    },
    onError: err => {
      toast.error(
        err?.response?.data?.message || 'Failed to submit withdrawal',
      );
    },
  });

  const canWithdraw = availableCredit >= 200;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Creator Total Earnings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="text-3xl font-bold">{availableCredit} credits</p>
          <p className="text-muted-foreground">
            ≈ ${availableAmount} available to withdraw
          </p>
        </CardContent>
      </Card>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Request Withdrawal</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(values => withdrawMutation.mutate(values))}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="withdrawal_credit">Credits To Withdraw</Label>
              <Input
                id="withdrawal_credit"
                type="number"
                placeholder="200"
                {...register('withdrawal_credit')}
              />
              {errors.withdrawal_credit && (
                <p className="text-sm text-red-500">
                  {errors.withdrawal_credit.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Withdraw Amount ($)</Label>
              <Input value={dollarAmount} disabled />
            </div>

            <div className="space-y-1.5">
              <Label>Select Payment System</Label>
              <Select
                value={paymentSystem}
                onValueChange={value => setValue('payment_system', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="bkash">Bkash</SelectItem>
                  <SelectItem value="rocket">Rocket</SelectItem>
                  <SelectItem value="nagad">Nagad</SelectItem>
                </SelectContent>
              </Select>
              {errors.payment_system && (
                <p className="text-sm text-red-500">
                  {errors.payment_system.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="account_number">Account Number</Label>
              <Input
                id="account_number"
                placeholder="01XXXXXXXXX"
                {...register('account_number')}
              />
              {errors.account_number && (
                <p className="text-sm text-red-500">
                  {errors.account_number.message}
                </p>
              )}
            </div>

            {canWithdraw ? (
              <Button
                type="submit"
                className="w-full"
                disabled={withdrawMutation.isPending}
              >
                {withdrawMutation.isPending ? 'Submitting...' : 'Withdraw'}
              </Button>
            ) : (
              <p className="text-sm text-center text-muted-foreground py-2">
                Insufficient credit
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
