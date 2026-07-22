'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Flag } from 'lucide-react';

import { reportSchema } from '@/lib/validations/report';
import { axiosSecure } from '@/lib/axios-secure';
import { useUserRole } from '@/hooks/useUserRole';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';

export default function ReportCampaignDialog({ campaign }) {
  const { session, role } = useUserRole();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(reportSchema) });

  const reportMutation = useMutation({
    mutationFn: async values => {
      return axiosSecure.post('/reports', {
        campaign_id: campaign._id,
        campaign_title: campaign.title,
        reporter_name: session.user.name,
        reporter_email: session.user.email,
        reason: values.reason,
      });
    },
    onSuccess: () => {
      toast.success('Report submitted - our team will review it');
      reset();
    },
    onError: () => toast.error('Failed to submit report'),
  });

  if (role !== 'supporter') return null;

  return (
    <Dialog>
      <DialogTrigger className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors rounded-full border px-3 py-1.5">
        <Flag className="w-3.5 h-3.5" />
        Report this campaign
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report &quot;{campaign.title}&quot;</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(values => reportMutation.mutate(values))}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              rows={4}
              placeholder="Describe why this campaign seems suspicious or fraudulent..."
              {...register('reason')}
            />
            {errors.reason && (
              <p className="text-sm text-red-500">{errors.reason.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={reportMutation.isPending}>
              {reportMutation.isPending ? 'Submitting...' : 'Submit Report'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
