"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  MotionValue,
  useMotionTemplate,
} from "framer-motion";

import { GALLERY_DATA } from "@/data/gallery";

interface BubbleConfig {
  url: string;
  size: number;
  x: number;
  y: number;
  range: [number, number];
  drift: number; 
  priority?: boolean;
}

const Bubble: React.FC<{
  config: BubbleConfig;
  progress: MotionValue<number>;
  index: number;
}> = React.memo(({ config, progress, index }) => {
  const [start, end] = config.range;
  const span = end - start;
  
  // Adjusted timing for a slightly faster fade in, letting the drift take focus
  const fadeInEnd = start + span * 0.3;
  const fadeOutStart = end - span * 0.3;

  const opacity = useTransform(
    progress,
    [start, fadeInEnd, fadeOutStart, end],
    [0, 1, 1, 0],
    { clamp: true }
  );
  
  const scale = useTransform(
    progress,
    [start, fadeInEnd, fadeOutStart, end],
    [0.8, 1, 1, 0.9],
    { clamp: true }
  );

  // DRIFT: Start below (positive Y) and drift up (negative Y) over the entire range
  const y = useTransform(
    progress, 
    [start, end], 
    [config.drift * 0.6, -config.drift], 
    { clamp: true }
  );

  // Ethereal blur effect for premium entrances
  const blurValue = useTransform(
    progress,
    [start, fadeInEnd, fadeOutStart, end],
    [16, 0, 0, 16],
    { clamp: true }
  );
  const filter = useMotionTemplate`blur(${blurValue}px)`;

  const floor = config.size * 0.55;
  const sizeStyle = `clamp(${floor}px, 50vw, ${config.size}px)`;

  return (
    <div
      className={config.priority ? undefined : "hidden xs:block"}
      style={{
        position: "absolute",
        left: `clamp(12%, ${config.x}%, 88%)`,
        top: `clamp(26%, ${config.y}%, 82%)`,
        width: sizeStyle,
        height: sizeStyle,
        transform: "translate(-50%, -50%)",
        zIndex: 10 + index,
      }}
    >
      <motion.div
        style={{
          width: "100%",
          height: "100%",
          opacity,
          scale,
          y,
          filter,
          willChange: "transform, opacity, filter",
        }}
        className="rounded-full overflow-hidden border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.3)] pointer-events-none"
      >
        <img
          src={config.url}
          alt="Wedding moment"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/10 pointer-events-none" />
      </motion.div>
    </div>
  );
});
Bubble.displayName = "Bubble";

/**
 * Updated to a sleek, ivory/frosted aesthetic for a luxury feel.
 */
const ScrollProgressBar: React.FC<{ progress: MotionValue<number> }> = ({ progress }) => {
  const opacity = useTransform(progress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);
  const glowLeft = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <motion.div
      style={{ opacity }}
      className="fixed top-0 left-0 right-0 z-[70] h-[3px] pointer-events-none"
    >
      <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-md border-b border-white/5" />

      <motion.div
        style={{ scaleX: progress, transformOrigin: "left" }}
        className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/60 to-white/90"
      />

      <motion.div
        style={{ left: glowLeft, top: "50%" }}
        className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/90 blur-[8px]"
      />
    </motion.div>
  );
};

export const BubbleScroll: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [randomImages, setRandomImages] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const validCategories = ["Wedding", "Pre-Wedding", "Engagement", "Rituals"];
    const filteredImages = GALLERY_DATA.filter((item) => validCategories.includes(item.category));

    const shuffled = [...filteredImages].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 8).map(item => item.imageUrl);

    while (selected.length > 0 && selected.length < 8) {
      selected.push(selected[Math.floor(Math.random() * selected.length)]);
    }

    setRandomImages(selected);
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Softened the spring for a more fluid, organic connection to the scroll wheel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    mass: 1,
    restDelta: 0.001,
  });

  const progress = prefersReducedMotion ? scrollYProgress : smoothProgress;
  
  // Parallax the background text slightly opposite to the scroll
  const bgTextY = useTransform(progress, [0, 1], ["0%", "15%"]);

  // Increased drift values for a more pronounced floating effect
  const bubbles: BubbleConfig[] = useMemo(() => {
    if (randomImages.length < 8) return [];
    return [
      { url: randomImages[0], size: 380, x: 18, y: 36, range: [0, 0.45], drift: 180, priority: true },
      { url: randomImages[1], size: 280, x: 74, y: 32, range: [0.1, 0.55], drift: 150, priority: true },
      { url: randomImages[2], size: 330, x: 30, y: 62, range: [0.25, 0.7], drift: 170, priority: true },
      { url: randomImages[3], size: 240, x: 80, y: 46, range: [0.35, 0.75], drift: 130 },
      { url: randomImages[4], size: 360, x: 14, y: 54, range: [0.5, 0.85], drift: 190, priority: true },
      { url: randomImages[5], size: 300, x: 66, y: 70, range: [0.6, 0.95], drift: 160 },
      { url: randomImages[6], size: 320, x: 28, y: 76, range: [0.75, 1.0], drift: 175, priority: true },
      { url: randomImages[7], size: 400, x: 60, y: 32, range: [0.8, 1.0], drift: 210 },
    ];
  }, [randomImages]);

  // Changed placeholder height to match the new 350vh
  if (!mounted || bubbles.length < 8) {
    if (prefersReducedMotion) {
      return <section ref={containerRef} className="relative py-24 bg-transparent min-h-[400px]" />;
    }
    return (
      <section ref={containerRef} className="relative h-[350vh] bg-transparent">
        <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <h2 className="text-[20vw] font-serif uppercase tracking-tighter leading-none dark:text-white text-black text-center select-none italic">
              Archive
            </h2>
          </div>
        </div>
      </section>
    );
  }

  if (prefersReducedMotion) {
    return (
      <section ref={containerRef} className="relative py-24 bg-transparent">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-6">
          {bubbles.map((b, i) => (
            <div key={i} className="aspect-square rounded-full overflow-hidden border border-white/10">
              <img src={b.url} alt="Wedding moment" loading="lazy" decoding="async" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    // Reduced container height from 800vh to 350vh for faster, more engaging scroll pacing
    <section ref={containerRef} className="relative h-[350vh] bg-transparent">
      <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none">
        
        {/* Added subtle parallax to the background text */}
        <motion.div 
          style={{ y: bgTextY }}
          className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none"
        >
          <h2 className="text-[20vw] font-serif uppercase tracking-tighter leading-none dark:text-white text-black text-center select-none italic">
            Archive
          </h2>
        </motion.div>

        <div className="relative h-full w-full">
          {bubbles.map((bubble, i) => (
            <Bubble key={i} config={bubble} progress={progress} index={i} />
          ))}
        </div>
      </div>

      <ScrollProgressBar progress={progress} />
    </section>
  );
};