'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { HeartHandshake } from 'lucide-react';
import Link from 'next/link';

import { contributionSchema } from '@/lib/validations/contribution';
import { axiosSecure } from '@/lib/axios-secure';
import { useUserRole } from '@/hooks/useUserRole';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

export default function ContributeForm({ campaign }) {
  const { session, role, credits } = useUserRole();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(contributionSchema) });

  const contributeMutation = useMutation({
    mutationFn: async values => {
      return axiosSecure.post('/contributions', {
        campaign_id: campaign._id,
        campaign_title: campaign.title,
        contribution_amount: values.contribution_amount,
        supporter_email: session.user.email,
        supporter_name: session.user.name,
        creator_email: campaign.creator_email,
        creator_name: campaign.creator_name,
      });
    },
    onSuccess: () => {
      toast.success('Contribution submitted — awaiting creator approval');
      reset();
      queryClient.invalidateQueries({
        queryKey: ['user-info', session.user.email],
      });
    },
    onError: err => {
      toast.error(err?.response?.data?.message || 'Failed to contribute');
    },
  });

  if (!session?.user) {
    return (
      <Card className="border-none shadow-sm sticky top-20">
        <CardContent className="p-6 text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Log in as a supporter to contribute to this campaign.
          </p>
          <Link href="/login">
            <Button className="w-full">Login to Contribute</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (role !== 'supporter') {
    return (
      <Card className="border-none shadow-sm sticky top-20">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            Only supporter accounts can contribute to campaigns.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm overflow-hidden py-0 sticky top-20">
      <div
        className="px-6 py-4 flex items-center gap-3"
        style={{
          background:
            'linear-gradient(135deg, var(--primary), var(--accent-brand))',
        }}
      >
        <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
          <HeartHandshake className="w-5 h-5 text-white" />
        </div>
        <h2 className="font-semibold text-white">Support this campaign</h2>
      </div>

      <CardContent className="p-6">
        <form
          onSubmit={handleSubmit(values => contributeMutation.mutate(values))}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="contribution_amount">
              Contribution Amount (min {campaign.minimum_contribution} credits)
            </Label>
            <Input
              id="contribution_amount"
              type="number"
              placeholder={`${campaign.minimum_contribution}`}
              {...register('contribution_amount')}
            />
            {errors.contribution_amount && (
              <p className="text-sm text-red-500">
                {errors.contribution_amount.message}
              </p>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            You have {credits} credits available.
          </p>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={contributeMutation.isPending}
          >
            {contributeMutation.isPending ? 'Submitting...' : 'Contribute'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
