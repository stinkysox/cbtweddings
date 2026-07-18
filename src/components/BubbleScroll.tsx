"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
  MotionValue,
} from "framer-motion";

import { GALLERY_DATA } from "@/data/gallery";

interface BubbleConfig {
  url: string;
  size: number; // desktop max size in px
  x: string;
  y: string;
  range: [number, number];
  drift: { x: number; y: number };
  priority?: boolean; // hide on very small screens to cut load
}

const Bubble: React.FC<{
  config: BubbleConfig;
  progress: MotionValue<number>;
  index: number;
}> = React.memo(({ config, progress, index }) => {
  const start = config.range[0];
  const end = config.range[1];
  const mid = (start + end) / 2;
  const riseEnd = Math.min(start + 0.2, end);

  const opacity = useTransform(progress, [start, riseEnd, end - 0.15, end], [0, 1, 1, 0]);
  const scale = useTransform(progress, [start, mid, end], [0.7, 1.15, 0.7]);
  const driftX = useTransform(progress, [start, end], ["0%", `${config.drift.x}%`]);
  const driftY = useTransform(
    progress,
    [start, riseEnd, end],
    ["140%", "0%", `${config.drift.y}%`]
  );

  // FIX: floor was size * 0.3, which pushed most bubbles down to ~130-230px
  // on a typical ~390px-wide phone — too small to register as a real
  // visual element (per screenshot). Bumped to size * 0.55 so bubbles read
  // clearly on mobile, and switched the responsive term from a fixed
  // 1440px basis to 45vw, so sizing tracks the actual viewport instead of
  // one fixed floor number — bigger phones (e.g. tablets in portrait) get
  // slightly larger bubbles than small phones, rather than everything
  // pinning to the same floor value.
  const floor = config.size * 0.55;
  const sizeStyle = `clamp(${floor}px, 45vw, ${config.size}px)`;

  return (
    <div
      className={config.priority ? undefined : "hidden xs:block"}
      style={{
        position: "absolute",
        left: `clamp(12%, ${config.x}, 88%)`,
        top: `clamp(20%, ${config.y}, 82%)`,
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
          x: driftX,
          y: driftY,
          willChange: "transform, opacity",
        }}
        className="rounded-full overflow-hidden border border-white/10 shadow-[0_0_36px_rgba(0,0,0,0.45)] pointer-events-none"
      >
        <img
          src={config.url}
          alt="Wedding moment"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 pointer-events-none" />
      </motion.div>
    </div>
  );
});
Bubble.displayName = "Bubble";

const ScrollIndicator: React.FC<{ progress: MotionValue<number> }> = ({ progress }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    x.set((clientX - (left + width / 2)) * 0.4);
    y.set((clientY - (top + height / 2)) * 0.4);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const opacity = useTransform(progress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);
  const rotate = useTransform(progress, [0, 1], [0, 360]);

  return (
    <motion.div
      style={{ opacity }}
      className="absolute bottom-12 right-12 md:right-24 z-50 flex flex-col items-center gap-4 pointer-events-auto"
    >
      {/* Magnetic mouse-follow only makes sense with a cursor — desktop only */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-20 h-20 hidden md:flex items-center justify-center cursor-pointer group"
      >
        <motion.div
          style={{ x: springX, y: springY }}
          className="relative w-full h-full flex items-center justify-center"
        >
          <svg className="w-full h-full -rotate-90">
            <circle cx="40" cy="40" r="36" fill="none" stroke="white" strokeWidth="0.5" className="opacity-10" />
            <motion.circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="#ca8a04"
              strokeWidth="1.5"
              strokeDasharray="226"
              style={{ pathLength: progress }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full shadow-[0_0_12px_rgba(202,138,4,0.6)] animate-pulse" />
          </div>
          <motion.div
            style={{ rotate }}
            className="absolute inset-0 rounded-full border border-dashed border-white/5 group-hover:border-yellow-600/20 transition-colors"
          />
        </motion.div>
      </div>

      {/* Static, cheap fallback ring for touch devices */}
      <div className="md:hidden relative w-14 h-14 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          <circle cx="28" cy="28" r="24" fill="none" stroke="white" strokeWidth="0.5" className="opacity-10" />
          <motion.circle
            cx="28"
            cy="28"
            r="24"
            fill="none"
            stroke="#ca8a04"
            strokeWidth="1.5"
            strokeDasharray="151"
            style={{ pathLength: progress }}
          />
        </svg>
        <div className="absolute w-1.5 h-1.5 bg-yellow-600 rounded-full shadow-[0_0_12px_rgba(202,138,4,0.6)] animate-pulse" />
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <span className="text-[9px] uppercase tracking-[0.5em] font-bold text-yellow-600/70">Scroll</span>
        <div className="w-px h-6 bg-gradient-to-b from-yellow-600/60 to-transparent" />
      </div>
    </motion.div>
  );
};

export const BubbleScroll: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [randomImages, setRandomImages] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only pick images from these categories as per request
    const validCategories = ["Wedding", "Pre-Wedding", "Engagement", "Rituals"];
    const filteredImages = GALLERY_DATA.filter((item) => validCategories.includes(item.category));

    // Shuffle and take 8
    const shuffled = [...filteredImages].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 8).map(item => item.imageUrl);

    // Fallback if not enough images
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

  // ONE spring smooths the whole sequence instead of 24 separate ones —
  // this is the main fix. Every bubble reads off this single value.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  const progress = prefersReducedMotion ? scrollYProgress : smoothProgress;

  const bubbles: BubbleConfig[] = useMemo(() => {
    if (randomImages.length < 8) return [];
    return [
      { url: randomImages[0], size: 360, x: "15%", y: "32%", range: [0, 0.4], drift: { x: 50, y: -80 }, priority: true },
      { url: randomImages[1], size: 260, x: "72%", y: "28%", range: [0.1, 0.5], drift: { x: -40, y: -60 }, priority: true },
      { url: randomImages[2], size: 310, x: "28%", y: "60%", range: [0.25, 0.65], drift: { x: 60, y: -100 }, priority: true },
      { url: randomImages[3], size: 220, x: "82%", y: "45%", range: [0.35, 0.75], drift: { x: -80, y: -70 } },
      { url: randomImages[4], size: 340, x: "10%", y: "50%", range: [0.5, 0.85], drift: { x: 100, y: -90 }, priority: true },
      { url: randomImages[5], size: 280, x: "68%", y: "70%", range: [0.6, 0.95], drift: { x: -30, y: -120 } },
      { url: randomImages[6], size: 300, x: "25%", y: "75%", range: [0.75, 1.0], drift: { x: 40, y: -90 }, priority: true },
      { url: randomImages[7], size: 380, x: "60%", y: "25%", range: [0.8, 1.0], drift: { x: -60, y: -150 } },
    ];
  }, [randomImages]);

  if (!mounted || bubbles.length < 8) {
    if (prefersReducedMotion) {
      return <section ref={containerRef} className="relative py-24 bg-transparent min-h-[400px]" />;
    }
    return (
      <section ref={containerRef} className="relative h-[800vh] bg-transparent">
        <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
            <h2 className="text-[20vw] font-serif uppercase tracking-tighter leading-none dark:text-white text-black text-center select-none italic">
              Archive
            </h2>
          </div>
        </div>
      </section>
    );
  }

  // Respect reduced-motion users entirely — no parallax, just a static collage.
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
    <section ref={containerRef} className="relative h-[800vh] bg-transparent">
      <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
          <h2 className="text-[20vw] font-serif uppercase tracking-tighter leading-none dark:text-white text-black text-center select-none italic">
            Archive
          </h2>
        </div>

        <div className="relative h-full w-full">
          {bubbles.map((bubble, i) => (
            <Bubble key={i} config={bubble} progress={progress} index={i} />
          ))}
        </div>

        <ScrollIndicator progress={progress} />
      </div>
    </section>
  );
};