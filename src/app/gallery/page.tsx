"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import Image from "next/image";
import { GALLERY_DATA } from "@/data/gallery";

const CATEGORIES = [
  "All",
  "Wedding",
  "Pre-Wedding",
  "Engagement",
  "Rituals",
  "Family",
  "Other Events",
];

export default function Gallery() {
  const [filter, setFilter] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);

  const filteredItems = GALLERY_DATA.filter((item) =>
    filter === "All" ? true : item.category === filter
  );

  const activeItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  const paginate = useCallback(
    (newDirection: number) => {
      if (lightboxIndex === null) return;
      setDirection(newDirection);
      let nextIndex = lightboxIndex + newDirection;
      if (nextIndex < 0) nextIndex = filteredItems.length - 1;
      if (nextIndex >= filteredItems.length) nextIndex = 0;
      setLightboxIndex(nextIndex);
    },
    [lightboxIndex, filteredItems.length]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") paginate(1);
      if (e.key === "ArrowLeft") paginate(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, paginate]);

  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? "hidden" : "";
  }, [lightboxIndex]);

  const handleSwipe = (e: any, { offset, velocity }: PanInfo) => {
    const swipePower = Math.abs(offset.x) * velocity.x;
    if (swipePower < -400) paginate(1);
    else if (swipePower > 400) paginate(-1);
  };

  return (
    <div className="relative min-h-screen pt-32 pb-40 px-4 md:px-8 bg-black">
      {/* Dynamic Style Tag to completely kill horizontal scrollbars safely */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
        .hide-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}} />

      {/* Title Area */}
      <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-serif italic text-4xl md:text-5xl text-white tracking-tight">
            The Collection
          </h1>
          <p className="text-white/40 text-xs tracking-[0.2em] uppercase mt-3">
            Cinematic Archives
          </p>
        </div>
        <span className="text-yellow-600 font-mono text-sm tracking-widest">
          {String(filteredItems.length).padStart(3, "0")} ORIGINALS
        </span>
      </div>

      {/* Fluid Masonry Grid */}
      <div className="max-w-7xl mx-auto">
        <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          <AnimatePresence>
            {filteredItems.map((item, i) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                key={item.id}
                className="relative break-inside-avoid rounded-2xl overflow-hidden group cursor-pointer bg-zinc-900 border border-white/5"
                onClick={() => setLightboxIndex(i)}
              >
                <div className="relative w-full overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={800}
                    height={1200}
                    className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                
                {/* Visual Clue: Expand Icon */}
                <div className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 md:scale-75 md:group-hover:scale-100 text-white/80 hover:text-white shadow-xl">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </div>
                
                <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-yellow-500 text-[10px] tracking-[0.3em] uppercase font-bold mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {item.category}
                  </span>
                  <h3 className="text-white font-serif italic text-2xl mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    {item.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Optimized Floating Filter Dock with Hidden Scrollbar */}
      <div className="fixed bottom-8 inset-x-0 z-60 flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1 p-1.5 rounded-full bg-black/60 backdrop-blur-2xl border border-white/10 shadow-2xl max-w-full overflow-x-auto hide-scrollbar select-none">
          {CATEGORIES.map((cat) => {
            const isActive = filter === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setFilter(cat);
                  setLightboxIndex(null); 
                }}
                className={`relative px-5 py-2.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-semibold whitespace-nowrap flex-shrink-0 transition-colors duration-300 ease-out outline-none focus:outline-none select-none [webkit-tap-highlight-color:transparent] ${
                  isActive ? "text-black font-bold" : "text-white/60 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="filter-pill"
                    className="absolute inset-0 bg-white rounded-full z-0 shadow-md"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Immersive Cinematic Lightbox */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-2xl flex items-center justify-center overflow-hidden touch-none"
          >
            {/* Fixed Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="fixed top-6 right-6 md:top-10 md:right-10 z-[120] w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/60 hover:text-white hover:bg-white/20 hover:scale-105 transition-all"
              aria-label="Close Lightbox"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.div
                key={activeItem.id}
                custom={direction}
                initial={{ opacity: 0, scale: 0.95, x: direction * 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: direction * -50 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={handleSwipe}
                className="absolute inset-0 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing w-full h-full px-4 pt-20 pb-32 md:pb-36"
              >
                {/* Image Container */}
                <div className="relative w-full max-w-5xl flex-1 min-h-0 mb-6 md:mb-10">
                  <Image
                    src={activeItem.imageUrl}
                    alt={activeItem.title}
                    fill
                    className="object-contain drop-shadow-2xl"
                    sizes="100vw"
                    priority
                    draggable={false}
                  />
                </div>
                
                {/* Text Container */}
                <div className="flex flex-col items-center text-center px-4 max-w-2xl shrink-0">
                  <span className="text-yellow-500 text-[10px] tracking-[0.4em] uppercase font-bold mb-3">
                    {activeItem.category}
                  </span>
                  <h2 className="text-white font-serif italic text-2xl md:text-4xl mb-3">
                    {activeItem.title}
                  </h2>
                  <p className="text-white/60 text-xs md:text-sm font-light leading-relaxed">
                    {activeItem.description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Fixed Pagination Dock */}
            <div className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-[110] flex items-center px-5 py-2.5 rounded-full bg-black/60 md:bg-white/10 backdrop-blur-xl border border-white/10 md:border-white/20 shadow-2xl">
              <button 
                onClick={() => paginate(-1)} 
                className="hidden md:block text-white/50 hover:text-white transition-colors p-2 mr-4"
                aria-label="Previous"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <div className="md:hidden flex items-center text-white/30 mr-4">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </div>
              
              <div className="flex flex-col items-center justify-center min-w-[3rem]">
                <span className="font-mono text-[10px] tracking-widest text-white font-semibold">
                  {String(lightboxIndex! + 1).padStart(2, "0")}
                </span>
                <span className="w-4 h-px bg-white/20 my-0.5" />
                <span className="font-mono text-[10px] tracking-widest text-white/40">
                  {String(filteredItems.length).padStart(2, "0")}
                </span>
              </div>
              
              <button 
                onClick={() => paginate(1)} 
                className="hidden md:block text-white/50 hover:text-white transition-colors p-2 ml-4"
                aria-label="Next"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>

              <div className="md:hidden flex items-center text-white/30 ml-4">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}