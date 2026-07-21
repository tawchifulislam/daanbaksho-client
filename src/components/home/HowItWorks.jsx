'use client';

import { motion } from 'framer-motion';
import { Search, HandCoins, TrendingUp } from 'lucide-react';
import Container from '@/components/layout/Container';

const steps = [
  {
    icon: Search,
    title: 'Discover a Campaign',
    desc: 'Browse causes, products, and projects across categories that match your interests.',
  },
  {
    icon: HandCoins,
    title: 'Contribute Credits',
    desc: 'Support campaigns with credits — purchase more anytime as you find causes worth backing.',
  },
  {
    icon: TrendingUp,
    title: 'Track the Impact',
    desc: 'Follow campaign progress and see exactly how your contribution helped reach the goal.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16">
      <Container>
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
