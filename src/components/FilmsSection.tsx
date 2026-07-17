"use client";

import React, { useState } from "react";
import { SectionWrapper } from "./SectionWrapper";
import Aurora from "./Aurora";

interface Film {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
}

const FILMS: Film[] = [
  {
    id: "1",
    title: "A Symphony of Vows",
    description: "A breathtaking cinematic journey capturing the intimate moments before the altar, set against a stunning heritage backdrop.",
    youtubeId: "UehmdFwDwfI",
  },
  {
    id: "2",
    title: "Midnight Whispers",
    description: "An editorial deep dive into an ethereal night-time engagement, where every frame speaks of pure, unscripted romance.",
    youtubeId: "w3sWdahfuLw",
  },
  {
    id: "3",
    title: "The Tuscan Sun",
    description: "A destination celebration that blends high fashion with raw, emotional storytelling under the golden Italian sun.",
    youtubeId: "8l_QtCsFrko",
  },
  {
    id: "4",
    title: "Heirloom Elegance",
    description: "Honoring cultural rituals through a modern, luxurious lens. A timeless record of two families becoming one.",
    youtubeId: "OHxWcPc6c44",
  },
  {
    id: "5",
    title: "Ocean's Embrace",
    description: "A coastal elopement defined by sweeping cinematic drone shots and deeply personal exchanged vows.",
    youtubeId: "LoyDZOoLPOs",
  },
  {
    id: "6",
    title: "Urban Opulence",
    description: "A sophisticated city wedding set in a historic museum, capturing architectural grandeur and avant-garde style.",
    youtubeId: "Jy0oDr1hzXg",
  },
  {
    id: "7",
    title: "The Secret Garden",
    description: "Lush botanicals and soft lighting frame this romantic, highly curated garden ceremony.",
    youtubeId: "h9Et_AiE6l0",
  },
];

// Extracted individual Film Player card to manage play state cleanly
const FilmPlayer = ({ film, isEven }: { film: Film; isEven: boolean }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Fallback to high-res YouTube thumbnail string automatically
  const thumbnailUrl = `https://img.youtube.com/vi/${film.youtubeId}/maxresdefault.jpg`;

  return (
    <SectionWrapper
      direction={isEven ? "right" : "left"}
      className="w-full md:w-3/5"
    >
      <div className="relative w-full aspect-video rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl bg-zinc-950 border border-white/5 ring-1 ring-white/10 group cursor-pointer">
        {!isPlaying ? (
          <div
            className="absolute inset-0 w-full h-full z-20 flex items-center justify-center"
            onClick={() => setIsPlaying(true)}
          >
            {/* Background Thumbnail Image with subtle hover scale */}
            <img
              src={thumbnailUrl}
              alt={`${film.title} Cinematic Thumbnail`}
              className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-[1.5s] ease-out group-hover:scale-105"
              loading="lazy"
            />

            {/* Premium, Minimalist Custom Play Overlay */}
            <div className="relative z-30 flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-black/20 backdrop-blur-md border border-white/20 transition-all duration-500 ease-out group-hover:bg-white group-hover:border-white shadow-xl group-hover:scale-110">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 md:w-8 md:h-8 text-white transition-colors duration-500 ease-out group-hover:text-black translate-x-[2px]"
              >
                <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
              </svg>
            </div>

            {/* Ambient luxury linear shading top/bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none z-20" />
          </div>
        ) : (
          <iframe
            className="relative z-10 w-full h-full object-cover"
            src={`https://www.youtube.com/embed/${film.youtubeId}?autoplay=1&rel=0&modestbranding=1&color=white`}
            title={film.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}

        {/* Decorative inner border frame */}
        <div className="absolute inset-0 z-40 pointer-events-none ring-1 ring-inset ring-white/10 rounded-[2rem] md:rounded-[3rem]" />
      </div>
    </SectionWrapper>
  );
};

export const FilmsSection = () => {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto overflow-hidden">
      {/* Aurora lives in this fixed-height hero block only — NOT the whole
          section below, which is several thousand px tall once you stack
          7 film cards. Keeping it to a screen-sized box means:
          (1) the glow reads as moving bands of light instead of a flat
              fill (the shader's math is relative to this box's height), and
          (2) the shader only ever renders a reasonable pixel count per
              frame instead of the entire scroll height — fixes the lag. */}
      <div className="relative mb-24 md:mb-32 flex min-h-[560px] items-center justify-center overflow-hidden rounded-[2rem] bg-black md:min-h-[680px] md:rounded-[3rem]">
        <Aurora />
        <SectionWrapper direction="up" className="relative z-10 w-full">
          <div className="px-6 text-center">
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
      </div>

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
              {/* Interactive Video Player */}
              <FilmPlayer film={film} isEven={isEven} />

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
