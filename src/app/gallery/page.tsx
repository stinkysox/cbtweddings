"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

export default function Gallery() {
  const [filter, setFilter] = useState<string>("All");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxItem(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = lightboxItem ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [lightboxItem]);

  const filteredItems = GALLERY_DATA.filter((item) =>
    filter === "All" ? true : item.category === filter
  );

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

        {/* Magazine-style Tab Nav */}
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
                        onClick={() => setLightboxItem(item)}
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
            onClick={() => setLightboxItem(null)}
          >
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-6 right-6 md:top-10 md:right-10 z-50 text-white/50 hover:text-white transition-colors p-2"
              aria-label="Close Lightbox"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 16 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-7xl max-h-[90vh] flex flex-col md:flex-row items-center gap-8 md:gap-16"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image — no ring, no rounding, no letterbox-highlighting border */}
              <div className="relative w-full md:w-2/3 h-[50vh] md:h-[85vh]">
                <Image
                  src={lightboxItem.imageUrl}
                  alt={lightboxItem.title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>

              {/* Text */}
              <div className="w-full md:w-1/3 text-center md:text-left flex flex-col justify-center px-4 md:px-0">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-yellow-600 uppercase text-[10px] md:text-xs tracking-[0.5em] font-bold mb-4"
                >
                  {lightboxItem.category}
                </motion.p>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-6xl font-serif text-white mb-6 italic leading-tight tracking-tight"
                >
                  {lightboxItem.title}
                </motion.h3>
                <div className="w-16 h-px bg-yellow-600/40 mb-6 mx-auto md:mx-0" />
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/70 text-sm md:text-base leading-relaxed font-light italic max-w-md mx-auto md:mx-0"
                >
                  {lightboxItem.description}
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}