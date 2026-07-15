'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { axiosSecure } from '@/lib/axios-secure';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function ReportsTable() {
  const queryClient = useQueryClient();

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const res = await axiosSecure.get('/reports');
      return res.data;
    },
  });

  const suspendMutation = useMutation({
    mutationFn: async id => axiosSecure.patch(`/reports/${id}/suspend`),
    onSuccess: () => {
      toast.success('Campaign suspended');
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
    onError: () => toast.error('Failed to suspend campaign'),
  });

  const deleteMutation = useMutation({
    mutationFn: async id => axiosSecure.patch(`/reports/${id}/delete-campaign`),
    onSuccess: () => {
      toast.success('Campaign deleted and supporters refunded');
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
    onError: () => toast.error('Failed to delete campaign'),
  });

  if (isLoading)
    return <p className="text-muted-foreground">Loading reports...</p>;

  return (
    <div className="rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campaign</TableHead>
            <TableHead>Reporter</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                No reports submitted yet.
              </TableCell>
            </TableRow>
          ) : (
            reports.map(r => (
              <TableRow key={r._id}>
                <TableCell className="font-medium">
                  {r.campaign_title}
                </TableCell>
                <TableCell>{r.reporter_name}</TableCell>
                <TableCell className="max-w-xs truncate">{r.reason}</TableCell>
                <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge
                    variant={r.status === 'resolved' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {r.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={
                      r.status === 'resolved' || suspendMutation.isPending
                    }
                    onClick={() => suspendMutation.mutate(r._id)}
                  >
                    Suspend
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={
                      r.status === 'resolved' || deleteMutation.isPending
                    }
                    onClick={() => deleteMutation.mutate(r._id)}
                  >
                    Delete Campaign
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
