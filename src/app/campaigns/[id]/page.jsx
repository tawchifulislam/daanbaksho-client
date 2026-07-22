'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { Calendar, Coins, User } from 'lucide-react';

import ContributeForm from '@/components/campaigns/ContributeForm';
import ReportCampaignDialog from '@/components/campaigns/ReportCampaignDialog';
import { Badge } from '@/components/ui/badge';
import Container from '@/components/layout/Container';

export default function CampaignDetailsPage() {
  const { id } = useParams();

  const { data: campaign, isLoading } = useQuery({
    queryKey: ['campaign-details', id],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/campaigns/${id}`,
      );
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <Container className="py-10">
        <p className="text-muted-foreground">Loading campaign...</p>
      </Container>
    );
  }

  if (!campaign) {
    return (
      <Container className="py-10">
        <p className="text-muted-foreground">Campaign not found.</p>
      </Container>
    );
  }

  const progress = Math.min(
    100,
    Math.round((campaign.raised_amount / campaign.funding_goal) * 100),
  );
  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24),
    ),
  );

  return (
    <Container className="py-8 sm:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-10">
        <div className="lg:col-span-3">
          <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden">
            <Image
              src={campaign.image_url}
              alt={campaign.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col justify-center">
          <Badge className="w-fit mb-3">{campaign.category}</Badge>
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
            {campaign.title}
          </h1>
          <p className="text-muted-foreground mt-2 inline-flex items-center gap-1.5 text-sm">
            <User className="w-4 h-4" />
            by {campaign.creator_name}
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-primary">
                {progress}% funded
              </span>
              <span className="text-muted-foreground">
                {campaign.raised_amount} / {campaign.funding_goal} credits
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background:
                    'linear-gradient(90deg, var(--primary), var(--accent-brand))',
                }}
              />
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-1">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {daysLeft} days left
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Coins className="w-4 h-4" />
                Min. {campaign.minimum_contribution}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-3">Campaign Story</h2>
            <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
              {campaign.story}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">
              What Supporters Receive
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {campaign.reward_info}
            </p>
          </div>

          <ReportCampaignDialog campaign={campaign} />
        </div>

        <div>
          <ContributeForm campaign={campaign} />
        </div>
      </div>
    </Container>
  );
}
