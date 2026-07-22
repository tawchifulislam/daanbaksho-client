'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { Coins } from 'lucide-react';
import Container from '@/components/layout/Container';

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
    <section className="py-16">
      <Container>
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
          Top Funded Campaigns
        </h2>

        {campaigns.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No campaigns funded yet - be the first to launch one!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {campaigns.map((campaign, i) => (
              <motion.div
                key={campaign._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link
                  href={`/campaigns/${campaign._id}`}
                  className="group flex items-center gap-4 rounded-xl border bg-card p-2.5 pr-4 hover:shadow-md hover:border-primary/30 transition-all"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={campaign.image_url}
                      alt={campaign.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                      {campaign.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1">
                      <Coins className="w-3 h-3 text-primary" />
                      {campaign.raised_amount} credits raised
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
