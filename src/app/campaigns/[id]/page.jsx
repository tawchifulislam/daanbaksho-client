'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';

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

  return (
    <Container className="py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative h-72 w-full rounded-xl overflow-hidden">
            <Image
              src={campaign.image_url}
              alt={campaign.title}
              fill
              className="object-cover"
            />
          </div>

          <Badge>{campaign.category}</Badge>
          <h1 className="text-3xl font-bold">{campaign.title}</h1>
          <p className="text-muted-foreground">by {campaign.creator_name}</p>

          <div className="space-y-1">
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {campaign.raised_amount} / {campaign.funding_goal} credits raised
            </p>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mt-6 mb-2">Campaign Story</h2>
            <p className="whitespace-pre-line text-muted-foreground">
              {campaign.story}
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-2">
              What Supporters Receive
            </h2>
            <p className="text-muted-foreground">{campaign.reward_info}</p>

            <p className="text-sm text-muted-foreground mt-4">
              Deadline: {new Date(campaign.deadline).toLocaleDateString()}
            </p>
          </div>

          <div className="mt-6">
            <ReportCampaignDialog campaign={campaign} />
          </div>
        </div>

        <div>
          <ContributeForm campaign={campaign} />
        </div>
      </div>
    </Container>
  );
}
