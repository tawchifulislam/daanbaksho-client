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
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function MyCampaignsTable() {
  const { session } = useUserRole();
  const queryClient = useQueryClient();
  const email = session?.user?.email;

  const [editingCampaign, setEditingCampaign] = useState(null);
  const [editValues, setEditValues] = useState({
    title: '',
    story: '',
    reward_info: '',
  });

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['my-campaigns', email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/campaigns/creator/${email}`);
      return res.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, values }) => {
      return axiosSecure.patch(`/campaigns/${id}`, values);
    },
    onSuccess: () => {
      toast.success('Campaign updated');
      queryClient.invalidateQueries({ queryKey: ['my-campaigns', email] });
      setEditingCampaign(null);
    },
    onError: () => toast.error('Failed to update campaign'),
  });

  const deleteMutation = useMutation({
    mutationFn: async id => axiosSecure.delete(`/campaigns/${id}`),
    onSuccess: () => {
      toast.success('Campaign deleted and supporters refunded');
      queryClient.invalidateQueries({ queryKey: ['my-campaigns', email] });
    },
    onError: () => toast.error('Failed to delete campaign'),
  });

  const openEdit = campaign => {
    setEditingCampaign(campaign);
    setEditValues({
      title: campaign.title,
      story: campaign.story,
      reward_info: campaign.reward_info,
    });
  };

  if (isLoading)
    return <p className="text-muted-foreground">Loading your campaigns...</p>;

  return (
    <div className="rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Raised</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                You haven&apos;t launched any campaigns yet.
              </TableCell>
            </TableRow>
          ) : (
            campaigns.map(campaign => (
              <TableRow key={campaign._id}>
                <TableCell className="font-medium">{campaign.title}</TableCell>
                <TableCell>{campaign.category}</TableCell>
                <TableCell className="capitalize">{campaign.status}</TableCell>
                <TableCell>
                  {campaign.raised_amount} / {campaign.funding_goal}
                </TableCell>
                <TableCell>
                  {new Date(campaign.deadline).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(campaign)}
                  >
                    Update
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-destructive text-white h-8 px-3 hover:bg-destructive/90 transition-colors">
                      Delete
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete this campaign?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete &quot;{campaign.title}
                          &quot; and refund all approved supporters their
                          contributed credits. This action cannot be undone.
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
            ))
          )}
        </TableBody>
      </Table>

      <Dialog
        open={!!editingCampaign}
        onOpenChange={open => !open && setEditingCampaign(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Campaign</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editValues.title}
                onChange={e =>
                  setEditValues(v => ({ ...v, title: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-story">Story</Label>
              <Textarea
                id="edit-story"
                rows={5}
                value={editValues.story}
                onChange={e =>
                  setEditValues(v => ({ ...v, story: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-reward">Reward Info</Label>
              <Textarea
                id="edit-reward"
                rows={3}
                value={editValues.reward_info}
                onChange={e =>
                  setEditValues(v => ({ ...v, reward_info: e.target.value }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() =>
                updateMutation.mutate({
                  id: editingCampaign._id,
                  values: editValues,
                })
              }
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
