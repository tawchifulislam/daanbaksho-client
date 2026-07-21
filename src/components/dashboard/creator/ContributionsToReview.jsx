'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Eye, Check, X } from 'lucide-react';

import { axiosSecure } from '@/lib/axios-secure';
import { useUserRole } from '@/hooks/useUserRole';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function ContributionsToReview() {
  const { session } = useUserRole();
  const email = session?.user?.email;
  const queryClient = useQueryClient();
  const [viewing, setViewing] = useState(null);

  const { data: contributions = [], isLoading } = useQuery({
    queryKey: ['pending-contributions', email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/contributions/creator/${email}`, {
        params: { status: 'pending' },
      });
      return res.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async id => axiosSecure.patch(`/contributions/${id}/approve`),
    onSuccess: () => {
      toast.success('Contribution approved');
      queryClient.invalidateQueries({
        queryKey: ['pending-contributions', email],
      });
      queryClient.invalidateQueries({ queryKey: ['creator-stats', email] });
    },
    onError: () => toast.error('Failed to approve contribution'),
  });

  const rejectMutation = useMutation({
    mutationFn: async id => axiosSecure.patch(`/contributions/${id}/reject`),
    onSuccess: () => {
      toast.success('Contribution rejected and refunded');
      queryClient.invalidateQueries({
        queryKey: ['pending-contributions', email],
      });
    },
    onError: () => toast.error('Failed to reject contribution'),
  });

  if (isLoading)
    return <p className="text-muted-foreground">Loading contributions...</p>;

  if (contributions.length === 0) {
    return (
      <Card className="border-none shadow-sm">
        <CardContent className="p-10 text-center text-muted-foreground">
          No contributions pending review.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {contributions.map(c => (
        <Card key={c._id} className="border-none shadow-sm">
          <CardContent className="p-4 flex items-center gap-4 flex-wrap">
            <Avatar className="w-10 h-10 border shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {c.supporter_name?.charAt(0)?.toUpperCase() || 'S'}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{c.supporter_name}</p>
              <p className="text-sm text-muted-foreground truncate">
                {c.campaign_title} ·{' '}
                <span className="font-medium text-primary">
                  {c.contribution_amount} credits
                </span>
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setViewing(c)}>
                <Eye className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="sm"
                onClick={() => approveMutation.mutate(c._id)}
                disabled={approveMutation.isPending}
              >
                <Check className="w-3.5 h-3.5 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => rejectMutation.mutate(c._id)}
                disabled={rejectMutation.isPending}
              >
                <X className="w-3.5 h-3.5 mr-1" />
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={!!viewing} onOpenChange={open => !open && setViewing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contribution Details</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Supporter:</span>{' '}
                {viewing.supporter_name} ({viewing.supporter_email})
              </p>
              <p>
                <span className="text-muted-foreground">Campaign:</span>{' '}
                {viewing.campaign_title}
              </p>
              <p>
                <span className="text-muted-foreground">Amount:</span>{' '}
                {viewing.contribution_amount} credits
              </p>
              <p>
                <span className="text-muted-foreground">Date:</span>{' '}
                {new Date(viewing.date).toLocaleString()}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
