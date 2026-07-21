'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';

import { axiosSecure } from '@/lib/axios-secure';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const statusVariant = {
  pending: 'secondary',
  approved: 'default',
  rejected: 'destructive',
  suspended: 'destructive',
};

export default function ManageCampaignsTable() {
  const queryClient = useQueryClient();

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['all-campaigns-admin'],
    queryFn: async () => {
      const res = await axiosSecure.get('/campaigns/admin/all');
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async id => axiosSecure.delete(`/campaigns/${id}`),
    onSuccess: () => {
      toast.success('Campaign deleted and supporters refunded');
      queryClient.invalidateQueries({ queryKey: ['all-campaigns-admin'] });
    },
    onError: () => toast.error('Failed to delete campaign'),
  });

  if (isLoading)
    return <p className="text-muted-foreground">Loading campaigns...</p>;

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
                by {campaign.creator_name}
              </p>
              <p className="text-sm text-muted-foreground">
                {campaign.raised_amount} / {campaign.funding_goal} credits
              </p>
            </div>

            <Badge
              variant={statusVariant[campaign.status] || 'outline'}
              className="capitalize shrink-0"
            >
              {campaign.status}
            </Badge>

            <AlertDialog>
              <AlertDialogTrigger className="inline-flex items-center justify-center rounded-md h-9 w-9 bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors shrink-0">
                <Trash2 className="w-4 h-4" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Delete &quot;{campaign.title}&quot;?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the campaign and refund all
                    approved supporters their contributed credits.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteMutation.mutate(campaign._id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
