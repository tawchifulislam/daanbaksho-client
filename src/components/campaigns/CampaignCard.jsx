import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

export default function CampaignCard({ campaign }) {
  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24),
    ),
  );
  const progress = Math.min(
    100,
    Math.round((campaign.raised_amount / campaign.funding_goal) * 100),
  );

  return (
    <Link
      href={`/campaigns/${campaign._id}`}
      className="rounded-xl border overflow-hidden hover:shadow-lg transition-shadow block"
    >
      <div className="relative h-44 w-full">
        <Image
          src={campaign.image_url}
          alt={campaign.title}
          fill
          className="object-cover"
        />
        <Badge className="absolute top-2 left-2">{campaign.category}</Badge>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold truncate">{campaign.title}</h3>
        <p className="text-sm text-muted-foreground">
          by {campaign.creator_name}
        </p>

        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {campaign.raised_amount} / {campaign.funding_goal} credits
          </span>
          <span>{daysLeft} days left</span>
        </div>
      </div>
    </Link>
  );
}
