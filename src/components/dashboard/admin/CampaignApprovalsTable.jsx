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

  return (
    <div className="rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Creator</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Funding Goal</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground"
              >
                No campaigns pending approval.
              </TableCell>
            </TableRow>
          ) : (
            campaigns.map(campaign => (
              <TableRow key={campaign._id}>
                <TableCell className="font-medium">{campaign.title}</TableCell>
                <TableCell>{campaign.creator_name}</TableCell>
                <TableCell>{campaign.category}</TableCell>
                <TableCell>{campaign.funding_goal}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      statusMutation.mutate({
                        id: campaign._id,
                        status: 'approved',
                      })
                    }
                  >
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
                    Reject
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
