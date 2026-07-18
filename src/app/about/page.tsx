"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { SectionWrapper } from "../../components/SectionWrapper";
import Link from "next/link";
import { siteContent } from "../../data/siteContent";
import { TeamSection } from "../../components/TeamSection";

export default function About() {
  const [isImageFocused, setIsImageFocused] = useState(false);
  const { about } = siteContent;

  return (
    <div className="pt-32 pb-24 overflow-hidden">
      {/* Hero Section */}
      <SectionWrapper className="max-w-5xl mx-auto px-6 text-center mb-32">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-label mb-6 block"
        >
          {about.hero.label}
        </motion.span>
        <h1 className="text-6xl md:text-9xl font-serif mb-10 leading-[0.85] tracking-tighter text-white">
          {about.hero.title} <br />
          <span className="italic">{about.hero.titleAccent}</span>
        </h1>
        <p className="premium-para text-xl md:text-2xl max-w-3xl mx-auto italic font-medium !text-zinc-300">
          {about.hero.description}
        </p>
      </SectionWrapper>

      {/* Philosophy Section */}
      <section className="max-w-7xl mx-auto px-6 mb-48">
        <div className="grid md:grid-cols-2 gap-24 items-center">
          <SectionWrapper direction="left">
            <motion.div
              onClick={() => setIsImageFocused(!isImageFocused)}
              onMouseEnter={() => setIsImageFocused(true)}
              onMouseLeave={() => setIsImageFocused(false)}
              className="aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl relative cursor-pointer"
            >
              <motion.img
                animate={{
                  filter: isImageFocused ? "grayscale(0%)" : "grayscale(100%)",
                  scale: isImageFocused ? 1.05 : 1,
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }}
                src={about.philosophy.image}
                alt="Architecture"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:hidden">
                <motion.p
                   animate={{ opacity: isImageFocused ? 0 : 1 }}
                  className="text-[8px] uppercase tracking-widest text-white/50 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full"
                >
                  Tap to reveal color
                </motion.p>
              </div>
            </motion.div>
          </SectionWrapper>

          <SectionWrapper direction="right">
            <h2 className="text-4xl md:text-6xl font-serif mb-8 leading-tight text-white">
              {about.philosophy.title} <br />
              {about.philosophy.titleAccent}
            </h2>
            <p className="premium-para text-lg mb-8">
              {about.philosophy.text1}
            </p>
            <p className="premium-para text-lg">
              {about.philosophy.text2}
            </p>

            <div className="mt-12 flex gap-8 border-t border-white/10 pt-12">
              {about.philosophy.stats.map((stat, i) => (
                <div key={i}>
                  <p className="text-3xl font-serif italic mb-1">{stat.value}</p>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </SectionWrapper>
        </div>
      </section>

      {/* The Pillars */}
      <section className="py-32 bg-white/5 rounded-[5rem] mx-4 mb-48">
        <div className="max-w-7xl mx-auto px-6">
          <SectionWrapper className="text-center mb-24">
            <h2 className="text-4xl md:text-7xl font-serif mb-6 text-white">
              {about.pillars.title}
            </h2>
            <p className="premium-label italic">
              {about.pillars.label}
            </p>
          </SectionWrapper>

          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {about.pillars.items.map((pillar, i) => (
              <SectionWrapper key={i} delay={i * 0.15}>
                {/*
                  FIX: previously this animated `backgroundColor` directly
                  via whileHover on top of a `glass` (backdrop-blur) class.
                  Animating an rgba background on a blurred element forces
                  the browser to recompute the blur every tick of the
                  transition, which reads as a flicker/jank on hover —
                  likely what "looks odd" here. Hover feedback is now a
                  pure transform (y-lift) plus a Tailwind `group-hover`
                  border-color change, both of which are cheap and don't
                  fight with the blur.
                */}
                <motion.div
                  whileHover={{ y: -10 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="group relative p-10 md:p-12 glass rounded-[3rem] border border-white/10 hover:border-yellow-600/30 h-full transition-colors duration-500 cursor-pointer overflow-hidden"
                >
                  {/* Numbered index — gives each card a visual anchor and
                      matches the numbering pattern already used in the
                      Archive section below, for consistency. */}
                  <span className="block text-[11px] font-mono tracking-[0.3em] text-yellow-600/50 group-hover:text-yellow-600 transition-colors mb-8">
                    0{i + 1}
                  </span>

                  <h4 className="text-3xl font-serif italic mb-6 text-yellow-600">
                    {pillar.title}
                  </h4>
                  <p className="premium-para !text-zinc-400">
                    {pillar.desc}
                  </p>

                  {/* Subtle static corner glow instead of an animated fill —
                      reads as premium without any per-frame repaint cost. */}
                  <div className="pointer-events-none absolute -bottom-16 -right-16 w-40 h-40 rounded-full bg-yellow-600/0 group-hover:bg-yellow-600/[0.06] blur-3xl transition-all duration-700" />
                </motion.div>
              </SectionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* The Archive Grid */}
      <section className="max-w-7xl mx-auto px-6 mb-32 md:mb-48">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <SectionWrapper direction="left" className="order-2 md:order-1">
            <h2 className="text-4xl md:text-6xl font-serif mb-8 leading-tight italic text-white">
              {about.archive.title}
            </h2>
            <div className="space-y-12">
              {about.archive.items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0.5 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ amount: 0.8 }}
                  className="flex gap-8 group cursor-default"
                >
                  <span className="text-2xl font-serif italic text-yellow-600/40 group-hover:text-yellow-600 transition-colors">
                    {item.step}
                  </span>
                  <div>
                    <h4 className="text-xl font-serif mb-2 tracking-tight text-white">
                      {item.title}
                    </h4>
                    <p className="premium-para text-sm">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </SectionWrapper>

          <SectionWrapper direction="right" className="order-1 md:order-2">
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileInView={{ y: 0, opacity: 1 }}
                initial={{ y: 40, opacity: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="aspect-[4/5] rounded-[2rem] overflow-hidden translate-y-12 shadow-xl"
              >
                <img
                  src={about.archive.images[0]}
                  alt="Detail 1"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div
                whileInView={{ y: 0, opacity: 1 }}
                initial={{ y: -40, opacity: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-xl"
              >
                <img
                  src={about.archive.images[1]}
                  alt="Detail 2"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </SectionWrapper>
        </div>
      </section>

      {/* Team Section */}
      <div className="mb-32 md:mb-48">
        <TeamSection />
      </div>

      {/* Final CTA */}
      <SectionWrapper className="text-center px-6">
        <h2 className="text-4xl md:text-7xl font-serif mb-12 italic text-white">
          {about.cta.title}
        </h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <Link
            href={about.cta.primaryLink}
            className="px-12 py-5 rounded-full bg-yellow-600 text-white uppercase tracking-[0.2em] text-[10px] font-bold shadow-lg active:scale-95 transition-transform"
          >
            {about.cta.primaryButton}
          </Link>
          <Link
            href={about.cta.secondaryLink}
            className="px-12 py-5 rounded-full border border-white/10 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-white/5 active:scale-95 transition-all text-white"
          >
            {about.cta.secondaryButton}
          </Link>
        </div>
      </SectionWrapper>
    </div>
  );
}