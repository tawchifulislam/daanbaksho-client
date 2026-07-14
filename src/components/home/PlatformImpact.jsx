'use client';

import { motion } from 'framer-motion';

const stats = [
  { value: '500+', label: 'Campaigns Launched' },
  { value: '12,000+', label: 'Supporters Joined' },
  { value: '$2.5M+', label: 'Credits Contributed' },
  { value: '94%', label: 'Campaign Success Rate' },
];

export default function PlatformImpact() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">
        Platform Impact in Numbers
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="text-center rounded-xl border p-6"
          >
            <p className="text-2xl md:text-3xl font-bold text-primary">
              {stat.value}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
