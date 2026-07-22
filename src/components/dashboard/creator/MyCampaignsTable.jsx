'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import Image from 'next/image';
import { Pencil, Trash2 } from 'lucide-react';

import { axiosSecure } from '@/lib/axios-secure';
import { uploadImageToImgbb } from '@/lib/imgbb';
import { useUserRole } from '@/hooks/useUserRole';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
import Loading from '@/components/ui/Loading';
import ImageInput from '@/components/shared/ImageInput';

const statusVariant = {
  pending: 'secondary',
  approved: 'default',
  rejected: 'destructive',
  suspended: 'destructive',
};

export default function MyCampaignsTable() {
  const { session } = useUserRole();
  const queryClient = useQueryClient();
  const email = session?.user?.email;

  const [editingCampaign, setEditingCampaign] = useState(null);
  const [editValues, setEditValues] = useState({
    title: '',
    story: '',
    reward_info: '',
    deadline: '',
  });
  const [editImage, setEditImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['my-campaigns', email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/campaigns/creator/${email}`);
      return res.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, values }) =>
      axiosSecure.patch(`/campaigns/${id}`, values),
    onSuccess: () => {
      toast.success('Campaign updated');
      queryClient.invalidateQueries({ queryKey: ['my-campaigns', email] });
      setEditingCampaign(null);
      setEditImage(null);
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
    setEditImage(null);
    setEditValues({
      title: campaign.title,
      story: campaign.story,
      reward_info: campaign.reward_info,
      deadline: campaign.deadline?.slice(0, 10) || '',
    });
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      let image_url;
      if (editImage instanceof File) {
        image_url = await uploadImageToImgbb(editImage);
      } else if (typeof editImage === 'string' && editImage) {
        image_url = editImage;
      }

      updateMutation.mutate({
        id: editingCampaign._id,
        values: { ...editValues, ...(image_url && { image_url }) },
      });
    } catch (err) {
      toast.error('Failed to process image');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading)
    return <Loading />;

  if (campaigns.length === 0) {
    return (
      <Card className="border-none shadow-sm">
        <CardContent className="p-10 text-center text-muted-foreground">
          You haven&apos;t launched any campaigns yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {campaigns.map(campaign => {
        const progress = Math.min(
          100,
          Math.round((campaign.raised_amount / campaign.funding_goal) * 100),
        );

        return (
          <Card
            key={campaign._id}
            className="border-none shadow-sm overflow-hidden"
          >
            <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
              <div className="relative w-full sm:w-40 h-32 sm:h-auto rounded-lg overflow-hidden shrink-0">
                <Image
                  src={campaign.image_url}
                  alt={campaign.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <h3 className="font-semibold truncate">{campaign.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {campaign.category}
                    </p>
                  </div>
                  <Badge
                    variant={statusVariant[campaign.status] || 'outline'}
                    className="capitalize"
                  >
                    {campaign.status}
                  </Badge>
                </div>

                <div className="space-y-1.5">
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${progress}%`,
                        background:
                          'linear-gradient(90deg, var(--primary), var(--accent-brand))',
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {campaign.raised_amount} / {campaign.funding_goal} credits
                    </span>
                    <span>
                      Deadline:{' '}
                      {new Date(campaign.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(campaign)}
                  >
                    <Pencil className="w-3.5 h-3.5 mr-1.5" />
                    Update
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium bg-destructive text-white h-8 px-3 hover:bg-destructive/90 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
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
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Dialog
        open={!!editingCampaign}
        onOpenChange={open => {
          if (!open) {
            setEditingCampaign(null);
            setEditImageFile(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
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
              <Label htmlFor="edit-deadline">Deadline</Label>
              <Input
                id="edit-deadline"
                type="date"
                value={editValues.deadline}
                onChange={e =>
                  setEditValues(v => ({ ...v, deadline: e.target.value }))
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

            <div className="space-y-1.5">
              <ImageInput
                value={editImage}
                onChange={setEditImage}
                previewUrl={editingCampaign?.image_url}
                label="Cover Image (leave unchanged to keep current)"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleSaveEdit}
              disabled={saving || updateMutation.isPending}
            >
              {saving || updateMutation.isPending
                ? 'Saving...'
                : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
