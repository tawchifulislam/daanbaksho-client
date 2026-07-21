import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
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
      className="group rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={campaign.image_url}
          alt={campaign.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0" />
        <Badge className="absolute top-3 left-3 bg-white/90 text-foreground hover:bg-white/90">
          {campaign.category}
        </Badge>
        <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/50 backdrop-blur px-2.5 py-1 text-xs font-medium text-white">
          <Clock className="w-3 h-3" />
          {daysLeft} days left
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {campaign.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            by {campaign.creator_name}
          </p>
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
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-primary">
              {progress}% funded
            </span>
            <span className="text-muted-foreground">
              {campaign.raised_amount}/{campaign.funding_goal}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
