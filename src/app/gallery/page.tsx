"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { GALLERY_DATA } from "@/data/gallery";
import { GalleryItem } from "@/types";
import Image from "next/image";

const CATEGORIES = [
  "All",
  "Wedding",
  "Pre-Wedding",
  "Engagement",
  "Rituals",
  "Family",
  "Other Events",
];

const ExpandIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M9 3H3v6M15 3h6v6M9 21H3v-6M15 21h6v-6" />
  </svg>
);

const ChevronIcon: React.FC<{ className?: string; direction: "left" | "right" }> = ({
  className,
  direction,
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
  >
    {direction === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
  </svg>
);

// Slide + fade variants, direction-aware for swipe/next/prev
const slideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 80 : -80,
    scale: 0.98,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -80 : 80,
    scale: 0.98,
  }),
};

export default function Gallery() {
  const [filter, setFilter] = useState<string>("All");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const filteredItems = GALLERY_DATA.filter((item) =>
    filter === "All" ? true : item.category === filter
  );

  const lightboxItem =
    lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  const goToNext = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null) return prev;
      setDirection(1);
      return (prev + 1) % filteredItems.length;
    });
  }, [filteredItems.length]);

  const goToPrev = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null) return prev;
      setDirection(-1);
      return (prev - 1 + filteredItems.length) % filteredItems.length;
    });
  }, [filteredItems.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, goToNext, goToPrev]);

  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [lightboxIndex]);

  // Reset lightbox if filter changes and index would be out of range
  useEffect(() => {
    if (lightboxIndex !== null && lightboxIndex >= filteredItems.length) {
      setLightboxIndex(null);
    }
  }, [filteredItems.length, lightboxIndex]);

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const swipeThreshold = 60;
    const velocityThreshold = 400;

    if (
      info.offset.x < -swipeThreshold ||
      info.velocity.x < -velocityThreshold
    ) {
      goToNext();
    } else if (
      info.offset.x > swipeThreshold ||
      info.velocity.x > velocityThreshold
    ) {
      goToPrev();
    }
  };

  return (
    <div className="pt-40 pb-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Editorial Header */}
        <div className="mb-14 md:mb-20 text-center">
          <span className="text-[10px] tracking-[0.5em] uppercase text-yellow-600/80 font-semibold">
            The Collection
          </span>
          <h1 className="font-serif italic text-4xl md:text-6xl text-white mt-4">
            Moments, Curated
          </h1>
        </div>

        {/* Magazine-style Index Grid */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 md:mb-24"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 border-t border-l border-white/10">
            {CATEGORIES.map((cat, i) => {
              const active = filter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setFilter(cat);
                    setHoveredId(null);
                  }}
                  className="relative border-r border-b border-white/10 px-5 py-6 text-left transition-colors duration-300 group"
                >
                  <span
                    className={`block text-[9px] tracking-[0.3em] mb-2 transition-colors ${
                      active ? "text-yellow-600" : "text-zinc-600 group-hover:text-zinc-500"
                    }`}
                  >
                    {String(i).padStart(2, "0")}
                  </span>
                  <span
                    className={`block text-[11px] md:text-xs uppercase tracking-[0.25em] transition-colors duration-300 ${
                      active ? "text-white font-semibold" : "text-zinc-500 group-hover:text-zinc-300"
                    }`}
                  >
                    {cat}
                  </span>

                  {active && (
                    <motion.span
                      layoutId="gallery-tab-dot"
                      className="absolute bottom-5 right-5 w-1.5 h-1.5 rounded-full bg-yellow-600"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Grid */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {filteredItems.length > 0 ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
              >
                {filteredItems.map((item, i) => {
                  const isLoaded = loadedImages[item.id];
                  const isHovered = hoveredId === item.id;

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="break-inside-avoid"
                    >
                      <div
                        className="group relative overflow-hidden rounded-sm border border-white/5 cursor-pointer"
                        onClick={() => {
                          setDirection(0);
                          setLightboxIndex(i);
                        }}
                        onMouseEnter={() => setHoveredId(item.id)}
                        onMouseLeave={() => setHoveredId(null)}
                      >
                        <div className="relative w-full aspect-[4/5] overflow-hidden bg-zinc-900">
                          <div
                            className={`absolute inset-0 shimmer transition-opacity duration-700 z-10 ${
                              isLoaded ? "opacity-0" : "opacity-100"
                            }`}
                          />
                          <div
                            className={`relative w-full h-full ${
                              !isLoaded ? "opacity-0" : "opacity-100"
                            } transition-opacity duration-1000`}
                          >
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              priority={GALLERY_DATA.indexOf(item) < 4}
                              className={`object-cover transition-all duration-1000 ${
                                isHovered ? "brightness-[0.35] scale-105" : "brightness-100 scale-100"
                              }`}
                              onLoad={() =>
                                setLoadedImages((prev) => ({ ...prev, [item.id]: true }))
                              }
                            />
                          </div>

                          {/* Issue-style index number */}
                          <span className="absolute top-5 left-5 z-20 font-serif italic text-white/50 text-sm">
                            {String(i + 1).padStart(2, "0")}
                          </span>

                          {/* Persistent expand cue — visible before hover, for touch users */}
                          <div
                            className={`absolute top-5 right-5 z-20 w-9 h-9 rounded-full border flex items-center justify-center backdrop-blur-sm transition-all duration-500 ${
                              isHovered
                                ? "border-yellow-600 bg-yellow-600/90 scale-110"
                                : "border-white/25 bg-black/30"
                            }`}
                          >
                            <ExpandIcon
                              className={`w-3.5 h-3.5 transition-colors ${
                                isHovered ? "text-black" : "text-white/80"
                              }`}
                            />
                          </div>
                        </div>

                        {/* Hover Overlay Text */}
                        <motion.div
                          initial={false}
                          animate={{ opacity: isHovered ? 1 : 0 }}
                          transition={{ duration: 0.4 }}
                          className="absolute inset-0 p-8 flex flex-col justify-end pointer-events-none bg-gradient-to-t from-black/70 via-black/10 to-transparent"
                        >
                          <div className="relative z-10">
                            <motion.p
                              animate={{ y: isHovered ? 0 : 12 }}
                              className="text-yellow-600 uppercase text-[9px] tracking-[0.5em] font-bold mb-3"
                            >
                              {item.category}
                            </motion.p>
                            <motion.h3
                              animate={{ y: isHovered ? 0 : 12 }}
                              transition={{ delay: 0.04 }}
                              className="text-2xl md:text-3xl font-serif text-white italic leading-tight mb-2"
                            >
                              {item.title}
                            </motion.h3>
                            <motion.p
                              animate={{ y: isHovered ? 0 : 12 }}
                              transition={{ delay: 0.08 }}
                              className="text-white/75 text-[12px] leading-relaxed max-w-[260px] font-light"
                            >
                              {item.description}
                            </motion.p>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center justify-center py-32 text-center"
              >
                <div className="w-24 h-[1px] bg-yellow-600/30 mb-8" />
                <h3 className="text-4xl md:text-5xl font-serif italic text-black dark:text-white mb-4">
                  Coming Soon
                </h3>
                <p className="text-gray-400 uppercase tracking-[0.4em] text-[10px] font-medium">
                  We are currently curating this collection
                </p>
                <div className="w-24 h-[1px] bg-yellow-600/30 mt-8" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/97 backdrop-blur-xl p-4 md:p-10"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 md:top-10 md:right-10 z-50 text-white/50 hover:text-white transition-colors p-2"
              aria-label="Close Lightbox"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Counter */}
            <div className="absolute top-7 left-6 md:top-11 md:left-10 z-50 text-white/40 text-[11px] tracking-[0.3em] uppercase font-serif italic">
              {String(lightboxIndex! + 1).padStart(2, "0")} / {String(filteredItems.length).padStart(2, "0")}
            </div>

            {/* Prev arrow — desktop only */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full border border-white/15 bg-black/30 backdrop-blur-sm items-center justify-center text-white/60 hover:text-black hover:bg-yellow-600 hover:border-yellow-600 transition-all duration-300"
              aria-label="Previous image"
            >
              <ChevronIcon direction="left" className="w-5 h-5" />
            </button>

            {/* Next arrow — desktop only */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full border border-white/15 bg-black/30 backdrop-blur-sm items-center justify-center text-white/60 hover:text-black hover:bg-yellow-600 hover:border-yellow-600 transition-all duration-300"
              aria-label="Next image"
            >
              <ChevronIcon direction="right" className="w-5 h-5" />
            </button>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={lightboxItem.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={handleDragEnd}
                className="relative w-full max-w-7xl max-h-[90vh] flex flex-col md:flex-row items-center gap-8 md:gap-16 touch-pan-y"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Image */}
                <div className="relative w-full md:w-2/3 h-[50vh] md:h-[85vh] pointer-events-none">
                  <Image
                    src={lightboxItem.imageUrl}
                    alt={lightboxItem.title}
                    fill
                    className="object-contain select-none"
                    sizes="100vw"
                    priority
                    draggable={false}
                  />
                </div>

                {/* Text */}
                <div className="w-full md:w-1/3 text-center md:text-left flex flex-col justify-center px-4 md:px-0">
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-yellow-600 uppercase text-[10px] md:text-xs tracking-[0.5em] font-bold mb-4"
                  >
                    {lightboxItem.category}
                  </motion.p>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.22 }}
                    className="text-4xl md:text-6xl font-serif text-white mb-6 italic leading-tight tracking-tight"
                  >
                    {lightboxItem.title}
                  </motion.h3>
                  <div className="w-16 h-px bg-yellow-600/40 mb-6 mx-auto md:mx-0" />
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/70 text-sm md:text-base leading-relaxed font-light italic max-w-md mx-auto md:mx-0"
                  >
                    {lightboxItem.description}
                  </motion.p>

                  {/* Mobile swipe hint */}
                  <div className="md:hidden flex items-center justify-center gap-2 mt-8 text-white/30 text-[10px] tracking-[0.3em] uppercase">
                    <ChevronIcon direction="left" className="w-3 h-3" />
                    <span>Swipe</span>
                    <ChevronIcon direction="right" className="w-3 h-3" />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}