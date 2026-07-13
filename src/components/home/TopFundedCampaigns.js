'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';

export default function TopFundedCampaigns() {
  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['top-funded-campaigns'],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/campaigns/top-funded`,
      );
      return res.data;
    },
  });

  if (isLoading) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
        Top Funded Campaigns
      </h2>

      {campaigns.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No campaigns funded yet - be the first to launch one!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign, i) => (
            <motion.div
              key={campaign._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-xl border overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Link href={`/campaigns/${campaign._id}`}>
                <div className="relative h-44 w-full">
                  <Image
                    src={campaign.image_url}
                    alt={campaign.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold truncate">{campaign.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {campaign.raised_amount} credits raised
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
