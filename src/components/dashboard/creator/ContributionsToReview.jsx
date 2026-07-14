'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { axiosSecure } from '@/lib/axios-secure';
import { useUserRole } from '@/hooks/useUserRole';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

  return (
    <div className="space-y-4">
      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Supporter</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contributions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  No contributions pending review.
                </TableCell>
              </TableRow>
            ) : (
              contributions.map(c => (
                <TableRow key={c._id}>
                  <TableCell className="font-medium">
                    {c.supporter_name}
                  </TableCell>
                  <TableCell>{c.campaign_title}</TableCell>
                  <TableCell>{c.contribution_amount}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewing(c)}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => approveMutation.mutate(c._id)}
                      disabled={approveMutation.isPending}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => rejectMutation.mutate(c._id)}
                      disabled={rejectMutation.isPending}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

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
