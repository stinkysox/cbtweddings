"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

import galleryImg1 from "@/assets/wedding-photography/cbt-wedding-ceremony-01.webp";
import galleryImg2 from "@/assets/engagement-photography/cbt-engagement-portrait-01.webp";
import galleryImg3 from "@/assets/pre-wedding-photography/cbt-pre-wedding-shoot-01.webp";
import galleryImg4 from "@/assets/wedding-rituals-photography/cbt-wedding-ritual-06.webp";
import galleryImg5 from "@/assets/wedding-photography/cbt-wedding-editorial-04.webp";

interface GalleryItem {
  id: number | string;
  url: string;
  title: string;
  category: string;
}

interface HorizontalGalleryProps {
  items?: GalleryItem[];
}

const DEFAULT_ITEMS: GalleryItem[] = [
  {
    id: 1,
    url: galleryImg1.src,
    title: "Shadows of Love",
    category: "Candid",
  },
  {
    id: 2,
    url: galleryImg2.src,
    title: "The Regal Veil",
    category: "Editorial",
  },
  {
    id: 3,
    url: galleryImg3.src,
    title: "Midnight Vows",
    category: "Cinematic",
  },
  {
    id: 4,
    url: galleryImg4.src,
    title: "Golden Hour Bliss",
    category: "Portraits",
  },
  {
    id: 5,
    url: galleryImg5.src,
    title: "Monochrome Magic",
    category: "Artistic",
  },
];

export const HorizontalGallery: React.FC<HorizontalGalleryProps> = ({ items = DEFAULT_ITEMS }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Calculate dynamic scroll height: roughly 100vh per item + a bit more for the end card
  // For 3 items, we'll use 300vh. For more, it scales.
  const scrollHeight = `${Math.max(200, (items.length + 1) * 80)}vh`;
  
  // Calculate horizontal translation. 
  // For 4 items plus end card, we need to scroll significantly.
  // On very narrow screens (320px-360px), we need to reach ~85-90% translation.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${Math.min(90, (items.length) * 22)}%`]);

  // Derived progress and opacity for the indicators
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={targetRef} style={{ height: scrollHeight }} className="relative bg-transparent">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Scroll Interaction Hint */}
        <motion.div 
          style={{ opacity: indicatorOpacity }}
          className="absolute top-1/2 left-12 md:left-24 -translate-y-1/2 z-20 pointer-events-none"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-[1px] bg-yellow-600" />
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-yellow-600">
              Scroll to explore
            </span>
          </div>
        </motion.div>

        <motion.div style={{ x }} className="flex gap-8 md:gap-12 px-12 md:px-24 w-full">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="group relative h-[60vh] md:h-[70vh] aspect-[4/5] flex-shrink-0 overflow-hidden rounded-3xl md:rounded-[3rem] bg-zinc-900 border border-white/5"
            >
              <div className="absolute inset-0 shimmer opacity-20" />
              <Image
                src={item.url}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end">
                <motion.span 
                  className="text-[10px] uppercase tracking-[0.3em] text-yellow-500 font-bold mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {item.category}
                </motion.span>
                <motion.h3 
                  className="text-3xl md:text-5xl font-serif text-white tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {item.title}
                </motion.h3>
              </div>
            </div>
          ))}
          
          {/* Ending Card / Call to Action */}
          <div className="h-[60vh] md:h-[70vh] aspect-[4/5] md:aspect-[1/1] flex-shrink-0 flex items-center justify-center p-6">
             <div className="text-center">
                <h3 className="text-3xl md:text-6xl font-serif text-white mb-8 italic leading-tight">And many more stories...</h3>
                <a href="/gallery" className="premium-label border border-white/20 px-8 py-4 rounded-full hover:bg-white/10 transition-colors inline-block">
                    View Full Archive
                </a>
             </div>
          </div>
        </motion.div>

        {/* Progress Bar Container */}
        <div className="absolute bottom-12 left-12 md:left-24 right-12 md:right-24 h-[1px] bg-white/10 overflow-hidden">
          <motion.div 
            style={{ width: progressWidth }}
            className="h-full bg-yellow-600 shadow-[0_0_10px_rgba(202,138,4,0.5)]"
          />
        </div>
      </div>
    </section>
  );
};
