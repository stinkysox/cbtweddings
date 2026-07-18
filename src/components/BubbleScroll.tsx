"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
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

/**
 * Sleek glass progress bar, fixed to the very top of the viewport.
 * — 3px tall, pointer-events-none, sits above the navbar (z-[70]) so it
 *   can never intercept a click regardless of the navbar's own z-index.
 * — Tracks the SAME `progress` MotionValue the bubbles use, so it reflects
 *   this section's scroll range specifically, not the whole page.
 * — Fades in/out at the section's edges instead of snapping, mirroring
 *   how the old indicator entered/exited.
 * — Track is a frosted hairline (backdrop-blur + low-opacity white); fill
 *   is a soft gold gradient with a small blurred "glow" riding its edge,
 *   which is what reads as "glass" rather than a flat loading bar.
 */
const ScrollProgressBar: React.FC<{ progress: MotionValue<number> }> = ({ progress }) => {
  const opacity = useTransform(progress, [0, 0.03, 0.97, 1], [0, 1, 1, 0]);
  const glowLeft = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <motion.div
      style={{ opacity }}
      className="fixed top-0 left-0 right-0 z-[70] h-[3px] pointer-events-none"
    >
      {/* frosted track */}
      <div className="absolute inset-0 bg-white/[0.05] backdrop-blur-sm border-b border-white/5" />

      {/* fill */}
      <motion.div
        style={{ scaleX: progress, transformOrigin: "left" }}
        className="absolute inset-0 bg-gradient-to-r from-yellow-600/30 via-yellow-500/80 to-yellow-300"
      />

      {/* soft glow riding the leading edge */}
      <motion.div
        style={{ left: glowLeft, top: "50%" }}
        className="absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-yellow-300/80 blur-[6px]"
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
      </div>

      <ScrollProgressBar progress={progress} />
    </section>
  );
};