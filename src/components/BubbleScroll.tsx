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
  x: number; // target x position in % (viewport width)
  y: number; // target y position in % (viewport height)
  range: [number, number];
  drift: { x: number; y: number }; // in vw/vh units, applied as a transform
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
  const scale = useTransform(progress, [start, riseEnd, mid, end], [0.55, 1.05, 1.2, 0.8]);
  const rotate = useTransform(progress, [start, mid, end], [config.drift.x > 0 ? -5 : 5, 0, config.drift.x > 0 ? 5 : -5]);

  // PERFORMANCE FIX: everything below is a single derived MotionValue per axis,
  // computed with a plain function instead of chaining useTransform -> useTransform
  // -> template string. It outputs ONE "transform: translate()" value, so the
  // browser only ever composites — it never has to re-run layout. This is what
  // kills the scroll jitter: the previous version animated `left`/`top` (layout
  // properties) every frame, which is expensive and was the actual cause of the
  // stutter, not the spring config.
  //
  // The bubble's outer wrapper is placed at its final target position (x%, y%)
  // statically (see JSX below) — never animated. To get the "bursts out from
  // center" effect without moving that layout position, we instead translate
  // the element by "distance from center to target" (in vw/vh, so it scales
  // with the viewport) at start, animating that distance down to 0 by riseEnd.
  // A bit of continuous drift (also in vw/vh) is layered on top of the same
  // value so it keeps drifting after it arrives.
  const centerToTargetX = 50 - config.x; // vw units needed to reach center from target
  const centerToTargetY = 50 - config.y; // vh units

  const translateX = useTransform(progress, (p) => {
    let offset: number;
    if (p <= start) offset = centerToTargetX;
    else if (p >= riseEnd) offset = 0;
    else {
      const t = (p - start) / (riseEnd - start);
      offset = centerToTargetX * (1 - t);
    }
    const driftT = Math.min(Math.max((p - start) / (end - start), 0), 1);
    const drift = config.drift.x * driftT;
    return `calc(-50% + ${(offset + drift).toFixed(2)}vw)`;
  });

  const translateY = useTransform(progress, (p) => {
    let offset: number;
    if (p <= start) offset = centerToTargetY;
    else if (p >= riseEnd) offset = 0;
    else {
      const t = (p - start) / (riseEnd - start);
      offset = centerToTargetY * (1 - t);
    }
    const driftT = Math.min(Math.max((p - start) / (end - start), 0), 1);
    const drift = config.drift.y * driftT;
    return `calc(-50% + ${(offset + drift).toFixed(2)}vh)`;
  });

  // Trimmed floor + vw basis so bubbles stay comfortably sized on mobile
  // without ballooning large enough to clip under the navbar.
  const floor = config.size * 0.5;
  const sizeStyle = `clamp(${floor}px, 50vw, ${config.size}px)`;

  return (
    <div
      className={config.priority ? undefined : "hidden xs:block"}
      style={{
        position: "absolute",
        // clamped, static target position — computed once, never animated,
        // so it costs nothing on scroll. Top clamp raised to 26% (from 20%)
        // to keep bubbles clear of the navbar/header area.
        left: `clamp(12%, ${config.x}%, 88%)`,
        top: `clamp(26%, ${config.y}%, 82%)`,
        width: sizeStyle,
        height: sizeStyle,
        zIndex: 10 + index,
      }}
    >
      <motion.div
        style={{
          width: "100%",
          height: "100%",
          opacity,
          scale,
          rotate,
          x: translateX,
          y: translateY,
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

  // Slightly stiffer / more damped spring than before to reduce overshoot
  // ringing, now that it's the only thing driving cheap transform updates.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 34,
    mass: 0.4,
  });

  const progress = prefersReducedMotion ? scrollYProgress : smoothProgress;

  // Targets kept in the safe visible band. Top values raised slightly
  // (min ~26% after clamping) so nothing sits under the navbar.
  const bubbles: BubbleConfig[] = useMemo(() => {
    if (randomImages.length < 8) return [];
    return [
      { url: randomImages[0], size: 380, x: 18, y: 36, range: [0, 0.4], drift: { x: 8, y: -14 }, priority: true },
      { url: randomImages[1], size: 280, x: 74, y: 32, range: [0.1, 0.5], drift: { x: -6, y: -10 }, priority: true },
      { url: randomImages[2], size: 330, x: 30, y: 62, range: [0.25, 0.65], drift: { x: 9, y: -16 }, priority: true },
      { url: randomImages[3], size: 240, x: 80, y: 46, range: [0.35, 0.75], drift: { x: -11, y: -12 } },
      { url: randomImages[4], size: 360, x: 14, y: 54, range: [0.5, 0.85], drift: { x: 14, y: -14 }, priority: true },
      { url: randomImages[5], size: 300, x: 66, y: 70, range: [0.6, 0.95], drift: { x: -5, y: -18 } },
      { url: randomImages[6], size: 320, x: 28, y: 76, range: [0.75, 1.0], drift: { x: 7, y: -14 }, priority: true },
      { url: randomImages[7], size: 400, x: 60, y: 32, range: [0.8, 1.0], drift: { x: -9, y: -20 } },
    ];
  }, [randomImages]);

  if (!mounted || bubbles.length < 8) {
    if (prefersReducedMotion) {
      return <section ref={containerRef} style={{ position: "relative" }} className="relative py-24 bg-transparent min-h-[400px]" />;
    }
    return (
      <section ref={containerRef} style={{ position: "relative" }} className="relative h-[800vh] bg-transparent">
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
      <section ref={containerRef} style={{ position: "relative" }} className="relative py-24 bg-transparent">
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
    <section ref={containerRef} style={{ position: "relative" }} className="relative h-[800vh] bg-transparent">
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