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

export default function Gallery() {
  const [filter, setFilter] = useState<string>("All");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  // Close lightbox on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxItem(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent scrolling when lightbox is open
  useEffect(() => {
    if (lightboxItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
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
        {/* Luxury Category Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-3 md:gap-6 mb-24"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setFilter(cat);
                setHoveredId(null);
              }}
              className={`px-8 py-3 rounded-full text-[10px] uppercase tracking-[0.4em] font-bold transition-all duration-500 border ${
                filter === cat
                  ? "bg-yellow-600 border-yellow-600 text-white shadow-xl shadow-yellow-600/20 scale-105"
                  : "border-white/5 text-gray-400 hover:text-white hover:border-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Masonry Grid or Coming Soon State */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {filteredItems.length > 0 ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8"
              >
                {filteredItems.map((item) => {
                  const isLoaded = loadedImages[item.id];
                  const isHovered = hoveredId === item.id;

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="break-inside-avoid"
                    >
                      <div
                        className="group relative overflow-hidden rounded-[2.5rem] glass-light border border-white/5 shadow-sm cursor-pointer"
                        onClick={() => setLightboxItem(item)}
                        onMouseEnter={() => setHoveredId(item.id)}
                        onMouseLeave={() => setHoveredId(null)}
                      >
                        <div className="relative w-full aspect-[4/5] overflow-hidden bg-zinc-900">
                          <div className={`absolute inset-0 shimmer transition-opacity duration-700 z-10 ${isLoaded ? 'opacity-0' : 'opacity-100'}`} />
                          <div className={`relative w-full h-full ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-1000`}>
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              priority={GALLERY_DATA.indexOf(item) < 4}
                              className={`object-cover transition-all duration-1000 ${
                                isHovered ? "brightness-[0.3] blur-[2px] scale-110" : "brightness-100 blur-0 scale-100"
                              }`}
                              onLoad={() =>
                                setLoadedImages((prev) => ({
                                  ...prev,
                                  [item.id]: true,
                                }))
                              }
                            />
                          </div>
                        </div>

                        {/* Hover Overlay Text */}
                        <motion.div
                          initial={false}
                          animate={{ opacity: isHovered ? 1 : 0 }}
                          transition={{ duration: 0.5 }}
                          className="absolute inset-0 p-10 flex flex-col justify-end pointer-events-none"
                        >
                          <div className="relative z-10">
                            <motion.p
                              animate={{ y: isHovered ? 0 : 20 }}
                              className="text-yellow-600 uppercase text-[9px] tracking-[0.6em] font-bold mb-4"
                            >
                              {item.category}
                            </motion.p>
                            <motion.h3
                              animate={{ y: isHovered ? 0 : 20 }}
                              transition={{ delay: 0.05 }}
                              className="text-3xl md:text-4xl font-serif text-white mb-5 italic leading-tight"
                            >
                              {item.title}
                            </motion.h3>
                            <motion.p
                              animate={{ y: isHovered ? 0 : 20 }}
                              transition={{ delay: 0.1 }}
                              className="text-white/80 text-[12px] md:text-sm leading-relaxed max-w-[280px] font-light italic"
                            >
                              {item.description}
                            </motion.p>
                          </div>
                        </motion.div>
                        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2.5rem] pointer-events-none" />
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              /* --- Coming Soon --- */
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

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-10"
            onClick={() => setLightboxItem(null)}
          >
            {/* Close Button */}
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
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-7xl max-h-[90vh] flex flex-col md:flex-row items-center gap-6 md:gap-16"
              onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
            >
              {/* Image Container */}
              <div className="relative w-full md:w-2/3 h-[50vh] md:h-[85vh] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <Image
                  src={lightboxItem.imageUrl}
                  alt={lightboxItem.title}
                  fill
                  className="object-contain bg-black/40"
                  sizes="100vw"
                  priority
                />
              </div>

              {/* Text Content */}
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
