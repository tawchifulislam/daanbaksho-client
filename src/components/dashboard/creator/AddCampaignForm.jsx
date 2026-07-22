"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Rocket } from "lucide-react";

import { campaignSchema } from "@/lib/validations/campaign";
import { uploadImageToImgbb } from "@/lib/imgbb";
import { axiosSecure } from "@/lib/axios-secure";
import { useUserRole } from "@/hooks/useUserRole";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import ImageInput from "@/components/shared/ImageInput";

const categories = ["Technology", "Art", "Community", "Health", "Education", "Environment"];

export default function AddCampaignForm() {
  const router = useRouter();
  const { session } = useUserRole();
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(campaignSchema),
    defaultValues: { category: "" },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const category = watch("category");

  const onSubmit = async values => {
    if (!image) {
      toast.error('Please add a cover image');
      return;
    }

    setSubmitting(true);
    try {
      const imageUrl =
        image instanceof File ? await uploadImageToImgbb(image) : image;

      await axiosSecure.post('/campaigns', {
        ...values,
        image_url: imageUrl,
        creator_email: session.user.email,
        creator_name: session.user.name,
      });

      toast.success('Campaign submitted for approval');
      router.push('/dashboard/my-campaigns');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add campaign');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto border-none shadow-sm overflow-hidden py-0">
      <div
        className="px-6 sm:px-8 py-6 flex items-center gap-3"
        style={{
          background:
            'linear-gradient(135deg, var(--primary), var(--accent-brand))',
        }}
      >
        <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <Rocket className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">
            Launch a New Campaign
          </h2>
          <p className="text-sm text-white/80">
            Tell your story and start collecting support
          </p>
        </div>
      </div>

      <CardContent className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-1.5">
              <Label htmlFor="title">Campaign Title</Label>
              <Input
                id="title"
                placeholder="Help us build a solar-powered water pump"
                {...register('title')}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <Label htmlFor="story">Campaign Story</Label>
              <Textarea
                id="story"
                rows={5}
                placeholder="Describe your campaign in detail..."
                {...register('story')}
              />
              {errors.story && (
                <p className="text-sm text-red-500">{errors.story.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={category}
                onValueChange={value => setValue('category', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="deadline">Deadline</Label>
              <Input id="deadline" type="date" {...register('deadline')} />
              {errors.deadline && (
                <p className="text-sm text-red-500">
                  {errors.deadline.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="funding_goal">Funding Goal (credits)</Label>
              <Input
                id="funding_goal"
                type="number"
                placeholder="1000"
                {...register('funding_goal')}
              />
              {errors.funding_goal && (
                <p className="text-sm text-red-500">
                  {errors.funding_goal.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="minimum_contribution">Minimum Contribution</Label>
              <Input
                id="minimum_contribution"
                type="number"
                placeholder="10"
                {...register('minimum_contribution')}
              />
              {errors.minimum_contribution && (
                <p className="text-sm text-red-500">
                  {errors.minimum_contribution.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <Label htmlFor="reward_info">Reward Info</Label>
              <Textarea
                id="reward_info"
                rows={3}
                placeholder="What supporters receive for pledging"
                {...register('reward_info')}
              />
              {errors.reward_info && (
                <p className="text-sm text-red-500">
                  {errors.reward_info.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <ImageInput value={image} onChange={setImage} />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full md:w-auto md:px-10"
            size="lg"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Launch Campaign'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}