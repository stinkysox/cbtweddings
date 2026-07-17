"use client";

import React from "react";
import { SectionWrapper } from "./SectionWrapper";

interface Film {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
}

// Placeholder data - user can replace these IDs with their actual YouTube IDs
const FILMS: Film[] = [
  {
    id: "1",
    title: "A Symphony of Vows",
    description: "A breathtaking cinematic journey capturing the intimate moments before the altar, set against a stunning heritage backdrop.",
    youtubeId: "dQw4w9WgXcQ", // Example placeholder ID
  },
  {
    id: "2",
    title: "Midnight Whispers",
    description: "An editorial deep dive into an ethereal night-time engagement, where every frame speaks of pure, unscripted romance.",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: "3",
    title: "The Tuscan Sun",
    description: "A destination celebration that blends high fashion with raw, emotional storytelling under the golden Italian sun.",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: "4",
    title: "Heirloom Elegance",
    description: "Honoring cultural rituals through a modern, luxurious lens. A timeless record of two families becoming one.",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: "5",
    title: "Ocean's Embrace",
    description: "A coastal elopement defined by sweeping cinematic drone shots and deeply personal exchanged vows.",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: "6",
    title: "Urban Opulence",
    description: "A sophisticated city wedding set in a historic museum, capturing architectural grandeur and avant-garde style.",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: "7",
    title: "The Secret Garden",
    description: "Lush botanicals and soft lighting frame this romantic, highly curated garden ceremony.",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: "8",
    title: "Eternal Glow",
    description: "The culmination of a weekend-long celebration, culminating in a spectacular fireworks display and a night of wild, cinematic dancing.",
    youtubeId: "dQw4w9WgXcQ",
  },
];

export const FilmsSection = () => {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto overflow-hidden">
      <SectionWrapper direction="up">
        <div className="text-center mb-24 md:mb-32">
          <h2 className="text-[10px] md:text-xs uppercase tracking-[0.6em] text-yellow-600 font-bold mb-6">
            Cinematic Archive
          </h2>
          <h3 className="text-5xl md:text-7xl font-serif text-white italic tracking-tighter">
            Our Films
          </h3>
          <p className="premium-para mt-8 max-w-xl mx-auto !text-white/70">
            Experience the motion and emotion. Our cinematic approach blends documentary storytelling with high-fashion aesthetics.
          </p>
        </div>
      </SectionWrapper>

      <div className="flex flex-col gap-32 md:gap-40">
        {FILMS.map((film, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={film.id}
              className={`flex flex-col ${
                isEven ? "md:flex-row" : "md:flex-row-reverse"
              } items-center gap-12 md:gap-24`}
            >
              {/* Video Player */}
              <SectionWrapper
                direction={isEven ? "right" : "left"}
                className="w-full md:w-3/5"
              >
                <div className="relative w-full aspect-video rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl glass-light border border-white/5 ring-1 ring-white/10 group">
                  {/* Subtle pulsing background while loading */}
                  <div className="absolute inset-0 bg-zinc-900 animate-pulse" />
                  
                  <iframe
                    className="relative z-10 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-[1.02]"
                    src={`https://www.youtube.com/embed/${film.youtubeId}?rel=0&modestbranding=1&color=white`}
                    title={film.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                  
                  {/* Gradient Overlay for luxury feel (doesn't block clicks because pointer-events-none) */}
                  <div className="absolute inset-0 z-20 pointer-events-none ring-1 ring-inset ring-white/10 rounded-[2rem] md:rounded-[3rem]" />
                </div>
              </SectionWrapper>

              {/* Text Content */}
              <SectionWrapper
                direction={isEven ? "left" : "right"}
                className="w-full md:w-2/5 flex flex-col justify-center text-center md:text-left items-center md:items-start"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-[1px] bg-yellow-600 hidden md:block" />
                  <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-yellow-600">
                    Film {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h4 className="text-4xl md:text-5xl font-serif text-white italic mb-6 leading-tight tracking-tight">
                  {film.title}
                </h4>
                <p className="premium-para text-sm md:text-base max-w-md !text-white/60">
                  {film.description}
                </p>
              </SectionWrapper>
            </div>
          );
        })}
      </div>
    </section>
  );
};
