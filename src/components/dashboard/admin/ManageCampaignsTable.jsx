'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { axiosSecure } from '@/lib/axios-secure';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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
    <div className="rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Creator</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Raised</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map(campaign => (
            <TableRow key={campaign._id}>
              <TableCell className="font-medium">{campaign.title}</TableCell>
              <TableCell>{campaign.creator_name}</TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {campaign.status}
                </Badge>
              </TableCell>
              <TableCell>
                {campaign.raised_amount} / {campaign.funding_goal}
              </TableCell>
              <TableCell className="text-right">
                <AlertDialog>
                  <AlertDialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-destructive text-white h-8 px-3 hover:bg-destructive/90 transition-colors">
                    Delete
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
