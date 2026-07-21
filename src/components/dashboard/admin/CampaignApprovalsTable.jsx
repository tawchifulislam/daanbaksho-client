'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import Image from 'next/image';
import { Check, X } from 'lucide-react';

import { axiosSecure } from '@/lib/axios-secure';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function CampaignApprovalsTable() {
  const queryClient = useQueryClient();

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['pending-campaigns'],
    queryFn: async () => {
      const res = await axiosSecure.get('/campaigns/admin/all?status=pending');
      return res.data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) =>
      axiosSecure.patch(`/campaigns/${id}/status`, { status }),
    onSuccess: (_, variables) => {
      toast.success(`Campaign ${variables.status}`);
      queryClient.invalidateQueries({ queryKey: ['pending-campaigns'] });
    },
    onError: () => toast.error('Failed to update campaign status'),
  });

  if (isLoading)
    return (
      <p className="text-muted-foreground">Loading pending campaigns...</p>
    );

  if (campaigns.length === 0) {
    return (
      <Card className="border-none shadow-sm">
        <CardContent className="p-10 text-center text-muted-foreground">
          No campaigns pending approval.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {campaigns.map(campaign => (
        <Card key={campaign._id} className="border-none shadow-sm">
          <CardContent className="p-4 flex items-center gap-4 flex-wrap">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
              <Image
                src={campaign.image_url}
                alt={campaign.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{campaign.title}</p>
              <p className="text-sm text-muted-foreground">
                by {campaign.creator_name} ·{' '}
                <Badge variant="outline" className="ml-1">
                  {campaign.category}
                </Badge>
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Goal:{' '}
                <span className="font-medium text-primary">
                  {campaign.funding_goal} credits
                </span>
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() =>
                  statusMutation.mutate({
                    id: campaign._id,
                    status: 'approved',
                  })
                }
              >
                <Check className="w-3.5 h-3.5 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() =>
                  statusMutation.mutate({
                    id: campaign._id,
                    status: 'rejected',
                  })
                }
              >
                <X className="w-3.5 h-3.5 mr-1" />
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
