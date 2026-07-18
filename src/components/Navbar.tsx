"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { siteContent } from "../data/siteContent";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Safely normalizes nav order: keeps layout intact while putting Contact then Wedding at the absolute end
  const navigationLinks = useMemo(() => {
    const rawLinks = siteContent.navbar?.links || [];
    const baseLinks = rawLinks.filter(
      (l) => l.name.toLowerCase() !== "contact" && l.name.toLowerCase() !== "wedding"
    );
    const contact = rawLinks.find((l) => l.name.toLowerCase() === "contact");
    const wedding = rawLinks.find((l) => l.name.toLowerCase() === "wedding");

    return [
      ...baseLinks,
      ...(contact ? [contact] : []),
      ...(wedding ? [wedding] : []),
    ];
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[60] px-6 md:px-12 pt-6 transition-all duration-500">
        <div
          className={`max-w-7xl mx-auto flex items-center justify-between rounded-full px-6 md:px-10 transition-all duration-500 border border-white/10 backdrop-blur-xl bg-black/10 shadow-sm ${
            scrolled ? "py-3 bg-black/40 border-white/5" : "py-5"
          }`}
        >
          {/* Brand Identity */}
          <Link href="/" className="group flex flex-col leading-none z-10">
            <span className="font-serif text-xl md:text-2xl tracking-tight text-white transition-colors duration-300">
              {siteContent.brand.name}
              <span className="text-yellow-600 dark:text-yellow-500">.</span>
            </span>
            <span className="hidden md:block text-[8px] tracking-[0.5em] uppercase text-white/30 font-medium mt-1 transition-colors group-hover:text-white/50">
              Est. Cinematography
            </span>
          </Link>

          {/* Desktop Layout Navigation Links */}
          <div
            className="hidden md:flex items-center gap-2 z-10"
            onMouseLeave={() => setHovered(null)}
          >
            {navigationLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  onMouseEnter={() => setHovered(link.path)}
                  className="relative px-5 py-2 text-[10px] tracking-[0.25em] uppercase font-semibold transition-colors duration-300 text-white/70 hover:text-white"
                >
                  {/* FIX: wrapped in AnimatePresence with an explicit exit
                      animation. Previously this pill only had enter/move
                      behavior via layoutId — when the mouse left the whole
                      nav (hovered -> null), it had no exit transition and
                      just vanished instantly, which read as a glitch. Now
                      it fades + scales down smoothly on the way out too. */}
                  <AnimatePresence>
                    {hovered === link.path && (
                      <motion.span
                        layoutId="nav-hover-pill"
                        className="absolute inset-0 rounded-full bg-white/[0.06] border border-white/5"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{
                          layout: { type: "spring", stiffness: 500, damping: 35 },
                          opacity: { duration: 0.15 },
                          scale: { duration: 0.15 },
                        }}
                      />
                    )}
                  </AnimatePresence>
                  <span
                    className={`relative z-10 ${
                      isActive ? "text-yellow-500 dark:text-yellow-400" : ""
                    }`}
                  >
                    {link.name}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="active-indicator"
                      // FIX: bumped above the hover pill (z-10) so the dot
                      // never gets visually muddied underneath the pill's
                      // background/border when the active link is also
                      // hovered — it now always reads on top, clearly.
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-yellow-500 z-20"
                    />
                  )}
                </Link>
              );
            })}

            {/* Principal Action Button */}
            <div className="ml-4">
              <Link
                href={siteContent.navbar.cta.path}
                className="group inline-flex items-center gap-3 px-6 py-2.5 rounded-full text-[10px] tracking-[0.25em] uppercase font-bold border border-white/20 bg-white/5 text-white transition-all duration-500 hover:bg-white hover:text-black hover:border-white"
              >
                <span>{siteContent.navbar.cta.text}</span>
                <svg
                  className="w-3 h-3 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Minimalist Mobile Menu Toggle Trigger */}
          <button
            className="md:hidden w-8 h-8 flex flex-col justify-center items-center gap-1.5 z-10 relative"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation drawer"
          >
            <span
              className={`h-[1px] bg-white transition-all duration-300 ease-out ${
                isOpen ? "rotate-45 translate-y-[3.5px] w-5" : "w-5"
              }`}
            />
            <span
              className={`h-[1px] bg-white transition-all duration-300 ease-out ${
                isOpen ? "-rotate-45 -translate-y-[3.5px] w-5" : "w-3.5 self-end"
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-50 md:hidden bg-black/95 backdrop-blur-2xl flex flex-col justify-between pt-36 pb-12 px-8 overflow-hidden"
          >
            {/* Nav Links Stack */}
            <div className="flex flex-col gap-2 max-w-xl">
              {navigationLinks.map((link, index) => {
                const isActive = pathname === link.path;
                return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
                    className="border-b border-white/5 py-4 flex items-baseline gap-4"
                  >
                    <span className="text-yellow-600 text-[10px] font-mono tracking-widest">
                      0{index + 1}
                    </span>
                    <Link
                      href={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`font-serif text-3xl tracking-tight transition-colors ${
                        isActive ? "text-yellow-500" : "text-white hover:text-white/80"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer Items Inside Menu Container */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navigationLinks.length * 0.05 + 0.1 }}
              className="flex flex-col gap-8 items-start w-full"
            >
              <Link
                href={siteContent.navbar.cta.path}
                onClick={() => setIsOpen(false)}
                className="w-full text-center px-8 py-4 rounded-full text-[10px] tracking-[0.3em] uppercase font-bold border border-white/10 bg-white/5 text-white active:bg-white active:text-black transition-all"
              >
                {siteContent.navbar.cta.text}
              </Link>

              <span className="text-[9px] tracking-[0.4em] uppercase text-white/20 font-medium">
                © {new Date().getFullYear()} {siteContent.brand.name}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};