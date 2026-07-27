"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { SectionWrapper } from "../../components/SectionWrapper";

interface Testimonial {
  id: string;
  name: string;
  event: string;
  quote: string;
}

const REVIEWS: Testimonial[] = [
  {
    id: "1",
    name: "Ananya & Rohan",
    event: "The Palace Rites",
    quote: "They didn’t just document the day; they captured the soul of our silence. The way they filmed our Varmala sequence felt like a frame from a classic epic.",
  },
  {
    id: "2",
    name: "Diya & Arjun",
    event: "The Heritage Reception",
    quote: "A masterclass in editorial cinematography. They managed to find quiet, intimate moments even amidst the beautiful chaos of our grand reception.",
  },
  {
    id: "3",
    name: "Meera & Sameer",
    event: "The Royal Courtyard",
    quote: "The attention to detail—from the texture of the heirloom silk to the silent exchange of glances during the Pheras—was absolutely breathtaking.",
  },
  {
    id: "4",
    name: "Sara & Ishaan",
    event: "The Estate Celebration",
    quote: "Seamless, professional, and artistically superior. CBT Weddings has a way of seeing light that feels almost supernatural. Our legacy is in safe hands.",
  },
];

function TestimonialCard({ 
  review, 
  isDimmed, 
  onHoverStart, 
  onHoverEnd 
}: { 
  review: Testimonial; 
  isDimmed: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  return (
    <motion.div
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      animate={{
        opacity: isDimmed ? 0.4 : 1,
        scale: isDimmed ? 0.98 : 1,
        filter: isDimmed ? "blur(2px)" : "blur(0px)",
      }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      className="group relative flex flex-col justify-between rounded-[2rem] border border-white/10 bg-neutral-950/50 p-10 md:p-14 overflow-hidden backdrop-blur-md min-h-[400px] transition-colors duration-500 hover:bg-neutral-900/50 hover:border-white/20"
    >
      {/* Decorative Quote Mark */}
      <div className="absolute -top-10 -left-6 text-[12rem] font-serif leading-none text-white/[0.03] select-none pointer-events-none transition-transform duration-700 group-hover:-translate-y-4 group-hover:text-yellow-600/[0.05]">
        “
      </div>

      <div className="relative z-10 flex flex-col gap-8 h-full justify-between">
        <p className="text-xl md:text-2xl italic font-serif leading-relaxed text-zinc-300 group-hover:text-white transition-colors duration-500">
          "{review.quote}"
        </p>

        <div className="flex flex-col items-start gap-1 pt-8 border-t border-white/10 group-hover:border-yellow-600/30 transition-colors duration-500">
          <h3 className="text-xl font-serif text-white tracking-wide">
            {review.name}
          </h3>
          <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-yellow-600/70 group-hover:text-yellow-500 transition-colors duration-500">
            {review.event}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="py-40 px-6 overflow-hidden bg-black selection:bg-yellow-600/30">
      <SectionWrapper className="max-w-5xl mx-auto flex flex-col md:flex-row items-end justify-between mb-32 gap-8">
        <div className="text-left">
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "3rem" }}
            viewport={{ once: true }}
            className="h-px bg-yellow-600 mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-yellow-600 uppercase tracking-[0.5em] text-[10px] font-bold mb-4"
          >
            Reflections
          </motion.p>
          <h2 className="text-5xl md:text-8xl font-serif text-white leading-[0.9]">
            Kind <span className="italic text-zinc-500">Words.</span>
          </h2>
        </div>
        <p className="max-w-xs text-sm text-zinc-400 font-light leading-relaxed">
          Stories of love, light, and legacy told through the lens of those who lived it.
        </p>
      </SectionWrapper>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6 md:gap-10 items-start">
        {REVIEWS.map((review, idx) => {
          const isDimmed = hoveredId !== null && hoveredId !== review.id;
          
          return (
            <div 
              key={review.id} 
              className={idx % 2 === 1 ? "md:mt-24" : ""}
            >
              <SectionWrapper
                direction={idx % 2 === 0 ? "left" : "right"}
                delay={idx * 0.15}
              >
                <TestimonialCard 
                  review={review}
                  isDimmed={isDimmed}
                  onHoverStart={() => setHoveredId(review.id)}
                  onHoverEnd={() => setHoveredId(null)}
                />
              </SectionWrapper>
            </div>
          );
        })}
      </div>
    </section>
  );
}