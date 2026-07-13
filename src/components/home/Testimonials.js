'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    name: 'Ayesha Rahman',
    role: 'Supporter',
    photo: 'https://i.pravatar.cc/150?img=47',
    quote:
      'DaanBaksho made it so easy to find causes I actually care about and track exactly where my credits went.',
  },
  {
    name: 'Rakib Hasan',
    role: 'Creator',
    photo: 'https://i.pravatar.cc/150?img=12',
    quote:
      'I launched my community library project here and reached my funding goal in three weeks. The dashboard made managing supporters simple.',
  },
  {
    name: 'Nusrat Jahan',
    role: 'Supporter',
    photo: 'https://i.pravatar.cc/150?img=32',
    quote:
      'The transparency of seeing approved vs pending contributions gave me real confidence in where my money was going.',
  },
];

export default function Testimonials() {
  return (
    <section className="bg-muted/40 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">
          What Our Community Says
        </h2>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="pb-10"
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <div className="flex flex-col items-center text-center px-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden mb-4">
                  <Image
                    src={t.photo}
                    alt={t.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-lg italic text-muted-foreground mb-4">
                  &quot;{t.quote}&quot;
                </p>
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
