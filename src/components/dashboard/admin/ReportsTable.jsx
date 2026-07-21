'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ShieldAlert, Trash2 } from 'lucide-react';

import { axiosSecure } from '@/lib/axios-secure';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

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

  if (reports.length === 0) {
    return (
      <Card className="border-none shadow-sm">
        <CardContent className="p-10 text-center text-muted-foreground">
          No reports submitted yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {reports.map(r => (
        <Card key={r._id} className="border-none shadow-sm">
          <CardContent className="p-4 flex items-start gap-4 flex-wrap">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-destructive" />
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium">{r.campaign_title}</p>
                <Badge
                  variant={r.status === 'resolved' ? 'default' : 'secondary'}
                  className="capitalize"
                >
                  {r.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Reported by {r.reporter_name} ·{' '}
                {new Date(r.date).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">{r.reason}</p>
            </div>

            <div className="flex gap-2 shrink-0">
              <Button
                size="sm"
                variant="outline"
                disabled={r.status === 'resolved' || suspendMutation.isPending}
                onClick={() => suspendMutation.mutate(r._id)}
              >
                Suspend
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={r.status === 'resolved' || deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(r._id)}
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
