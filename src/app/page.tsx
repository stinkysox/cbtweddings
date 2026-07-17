"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { SectionWrapper } from "../components/SectionWrapper";
import { BubbleScroll } from "../components/BubbleScroll";
import { MagneticButton } from "../components/MagneticButton";
import Image from "next/image";
import { siteContent } from "../data/siteContent";
import { TextReveal } from "../components/TextReveal";
import { FilmsSection } from "../components/FilmsSection";

export default function Home() {
  const { scrollY } = useScroll();
  const heroContentY = useTransform(scrollY, [0, 500], [0, 100]);
  const { home } = siteContent;

  return (
    <div className="w-full">
      {/* Image Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://i.postimg.cc/Y9K8Gb9V/cbt-hero.jpg"
            alt="CBT Weddings Hero"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
        </div>

        <motion.div
          style={{ y: heroContentY }}
          className="relative z-10 text-center px-6"
        >
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-7xl md:text-9xl font-serif text-white mb-8 tracking-tighter leading-[1.1] md:leading-none"
          >
            {home.hero.title} <br />
            <span className="italic text-yellow-600 dark:text-yellow-500">
              {home.hero.titleAccent}
            </span>{" "}
            {home.hero.titleEnd}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.5 }}
            className="premium-label mb-12 px-4 text-white/90"
          >
            {home.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
          >
            <MagneticButton>
              <Link
                href={home.hero.ctaLink}
                className="inline-block px-12 py-5 glass text-white rounded-full uppercase tracking-[0.2em] hover:bg-white/10 transition-all text-[10px] font-bold glow-button border border-white/20 shadow-lg magnetic-target"
              >
                {home.hero.cta}
              </Link>
            </MagneticButton>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10">
          <span className="text-[10px] text-white/60 uppercase tracking-[0.3em] vertical-text">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 15, 0], opacity: [0.2, 0.8, 0.2] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent"
          />
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-40 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="grid md:grid-cols-2 gap-32 items-center">
          <SectionWrapper direction="left">
            <h2 className="text-4xl md:text-7xl font-serif mb-10 leading-none tracking-tight text-white">
              {home.intro.title} <br />
              <span className="text-yellow-600 italic">{home.intro.titleAccent}</span>
            </h2>
            <p className="premium-para mb-14 max-w-lg">
              {home.intro.description}
            </p>
            <Link
              href={home.intro.linkUrl}
              className="group flex items-center gap-8 text-[10px] uppercase tracking-[0.4em] font-bold dark:text-white"
            >
              {home.intro.linkText}
              <span className="w-20 h-[1px] bg-black dark:bg-white group-hover:w-32 transition-all duration-700"></span>
            </Link>
          </SectionWrapper>

          <SectionWrapper direction="right" delay={0.2}>
            <div className="aspect-[4/5] overflow-hidden rounded-[3rem] relative shadow-2xl bg-zinc-900">
              <Image
                src={home.intro.image}
                alt="Brand Intro"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-[2s] hover:scale-110"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/10 rounded-[3rem]"></div>
            </div>
          </SectionWrapper>
        </div>
      </section>

      {/* Bubble Scroll Section */}
      <div className="relative z-10 mb-20">
        <BubbleScroll />
      </div>

   

      {/* Why Us Cards */}
      <section className="py-40 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          {home.services.map((item, idx) => (
            <SectionWrapper key={idx} direction="up" delay={idx * 0.2}>
              <div className="p-16 rounded-[3rem] glass border border-white/5 h-full flex flex-col items-center text-center group hover:bg-yellow-600/5 transition-all duration-700 shadow-sm hover:shadow-xl">
                <div className="w-16 h-16 rounded-full border border-yellow-600/20 flex items-center justify-center mb-10 group-hover:bg-yellow-600 group-hover:text-white transition-all duration-500">
                  <span className="font-serif italic text-2xl dark:text-white group-hover:text-white">
                    {idx + 1}
                  </span>
                </div>
                <h3 className="text-3xl font-serif mb-6 italic tracking-tight text-white">
                  {item.title}
                </h3>
                <p className="premium-para text-xs uppercase !leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </SectionWrapper>
          ))}
        </div>
      </section>
         {/* Films Section */}
      <div className="relative z-10 bg-gradient-to-b from-transparent via-black/40 to-transparent">
        <FilmsSection />
      </div>

      {/* CTA */}
      <section className="pb-40 px-6 overflow-hidden">
        <SectionWrapper
          direction="up"
          className="max-w-6xl mx-auto glass rounded-[5rem] p-12 md:p-24 border border-yellow-600/20 relative overflow-hidden shadow-2xl flex flex-col items-center text-center"
        >
          <div className="absolute top-0 right-0 p-16 opacity-[0.05] pointer-events-none text-yellow-600">
            <svg
              width="300"
              height="300"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>

          <h2 className="text-5xl md:text-8xl font-serif mb-12 italic leading-none tracking-tighter text-[#1A1A1A] dark:text-white">
            {home.finalCta.title}
          </h2>

          <p className="premium-para text-lg md:text-xl mb-16 max-w-2xl mx-auto !text-zinc-400">
            {home.finalCta.description}
          </p>

          <div className="flex justify-center w-full px-4 sm:px-0">
            <MagneticButton distance={0.3} className="w-full sm:w-auto">
              <Link
                href={home.finalCta.buttonLink}
                className="block sm:inline-block px-10 md:px-16 py-6 md:py-7 rounded-full bg-yellow-600 text-white uppercase tracking-[0.4em] font-bold text-[9px] md:text-[10px] glow-button transition-all hover:scale-105 active:scale-95 magnetic-target text-center shadow-xl shadow-yellow-600/20"
              >
                {home.finalCta.buttonText}
              </Link>
            </MagneticButton>
          </div>
        </SectionWrapper>
      </section>
    </div>
  );
}