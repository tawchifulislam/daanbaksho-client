'use client';

import { motion } from 'framer-motion';
import { Cpu, Palette, Users, HeartPulse, BookOpen, Leaf } from 'lucide-react';

const categories = [
  { icon: Cpu, label: 'Technology' },
  { icon: Palette, label: 'Art' },
  { icon: Users, label: 'Community' },
  { icon: HeartPulse, label: 'Health' },
  { icon: BookOpen, label: 'Education' },
  { icon: Leaf, label: 'Environment' },
];

export default function ExploreByCategory() {
  return (
    <section className="bg-muted/40 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">
          Explore by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border bg-background p-5 hover:shadow-md transition-shadow cursor-pointer"
            >
              <cat.icon className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">{cat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
