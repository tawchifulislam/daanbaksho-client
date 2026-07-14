'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import Link from 'next/link';

import { contributionSchema } from '@/lib/validations/contribution';
import { axiosSecure } from '@/lib/axios-secure';
import { useUserRole } from '@/hooks/useUserRole';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground mb-3">
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
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            Only supporter accounts can contribute to campaigns.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Support this campaign</CardTitle>
      </CardHeader>
      <CardContent>
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
            disabled={contributeMutation.isPending}
          >
            {contributeMutation.isPending ? 'Submitting...' : 'Contribute'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
