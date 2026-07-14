'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import 'swiper/css';
import 'swiper/css/pagination';

const slides = [
  {
    title: 'Fund the Ideas That Matter',
    subtitle:
      'Join thousands of supporters backing creators, causes, and communities.',
    gradient: 'from-slate-900 to-slate-700',
  },
  {
    title: 'Launch Your Own Campaign',
    subtitle:
      'Turn your project into reality with support from people who believe in you.',
    gradient: 'from-indigo-950 to-indigo-800',
  },
  {
    title: 'Every Contribution Counts',
    subtitle: 'Small credits, big impact. Be part of a story worth funding.',
    gradient: 'from-emerald-950 to-emerald-800',
  },
];

export default function HeroSlider() {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 4500, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      loop
      className="h-105 md:h-130"
    >
      {slides.map((slide, i) => (
        <SwiperSlide key={i}>
          <div
            className={`h-full w-full bg-linear-to-br ${slide.gradient} flex items-center justify-center text-center px-6`}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-2xl"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                {slide.title}
              </h1>
              <p className="text-white/80 text-base md:text-lg mb-6">
                {slide.subtitle}
              </p>
              <Link href="/campaigns">
                <Button size="lg">Explore Campaigns</Button>
              </Link>
            </motion.div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
