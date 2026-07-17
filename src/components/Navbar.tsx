"use client";

import React, { useState, useEffect } from "react";
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
    setScrolled(latest > 40);
  });

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[60] px-4 md:px-6 pt-4 md:pt-6">
        {/* Liquid glass capsule */}
        <div
          className={`max-w-7xl mx-auto flex items-center justify-between rounded-full px-5 md:px-8 transition-all duration-700 ${
            scrolled ? "py-2.5" : "py-3.5"
          } relative overflow-hidden backdrop-blur-2xl bg-gradient-to-b from-white/[0.09] to-white/[0.02] border border-white/[0.14] shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_-1px_1px_rgba(255,255,255,0.05),0_20px_50px_-15px_rgba(0,0,0,0.6)]`}
        >
          {/* top specular highlight streak */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          {/* subtle inner glow */}
          <div className="pointer-events-none absolute -top-20 left-1/4 w-1/2 h-32 bg-white/[0.06] blur-3xl rounded-full" />

          {/* Brand */}
          <Link href="/" className="group relative z-10 flex flex-col leading-none">
            <span className="font-serif text-2xl md:text-[26px] tracking-tight text-white">
              {siteContent.brand.name}
              <span className="text-yellow-500 group-hover:tracking-widest transition-all duration-500">.</span>
            </span>
            <span className="hidden md:block text-[9px] tracking-[0.4em] uppercase text-white/40 mt-0.5">
              Est. Cinematography
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1 relative z-10">
            {siteContent.navbar.links.map((link) => {
              const active = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  onMouseEnter={() => setHovered(link.path)}
                  onMouseLeave={() => setHovered(null)}
                  className="relative px-4 py-2 text-[11px] tracking-[0.22em] uppercase transition-colors duration-300"
                >
                  {hovered === link.path && (
                    <motion.span
                      layoutId="nav-liquid-pill"
                      className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]"
                      transition={{ type: "spring", stiffness: 500, damping: 32 }}
                    />
                  )}
                  <span
                    className={`relative z-10 transition-colors duration-300 ${
                      active ? "text-yellow-500" : "text-white/70 group-hover:text-white"
                    }`}
                  >
                    {link.name}
                  </span>
                  {active && (
                    <span className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 w-1 h-1 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.7)]" />
                  )}
                </Link>
              );
            })}

            {/* CTA — liquid glass pill */}
            <motion.div whileTap={{ scale: 0.95 }} className="ml-3">
              <Link
                href={siteContent.navbar.cta.path}
                className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full overflow-hidden backdrop-blur-md bg-white/10 border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)]"
              >
                <span className="absolute inset-0 rounded-full bg-white scale-0 group-hover:scale-100 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] origin-center" />
                <span className="relative z-10 text-[11px] tracking-[0.28em] uppercase text-white group-hover:text-black transition-colors duration-500">
                  {siteContent.navbar.cta.text}
                </span>
                <svg
                  className="relative z-10 w-3 h-3 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 text-black transition-all duration-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </motion.div>
          </div>

          {/* Mobile Toggle — glass circle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="md:hidden relative z-10 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md bg-white/10 border border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-5 h-4 flex flex-col justify-between">
              <span
                className={`h-px bg-white transition-all duration-300 ${
                  isOpen ? "rotate-45 translate-y-[7px] w-5" : "w-5"
                }`}
              />
              <span
                className={`h-px bg-yellow-500 transition-all duration-300 ${
                  isOpen ? "opacity-0" : "w-3.5 self-end"
                }`}
              />
              <span
                className={`h-px bg-white transition-all duration-300 ${
                  isOpen ? "-rotate-45 -translate-y-[7px] w-5" : "w-5"
                }`}
              />
            </div>
          </motion.button>
        </div>
      </nav>

      {/* Mobile Full-Screen Drawer — frosted glass */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 md:hidden bg-black/60 backdrop-blur-3xl flex flex-col justify-center px-10 overflow-hidden"
          >
            {/* ambient glass glow */}
            <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 bg-yellow-500/[0.07] blur-3xl rounded-full" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 w-72 h-72 bg-white/[0.05] blur-3xl rounded-full" />

            {/* Decorative placeholder photos */}
            <div className="absolute right-6 top-28 hidden sm:flex flex-col items-end gap-5 pointer-events-none">
              <motion.img
                initial={{ opacity: 0, x: 24, rotate: -6 }}
                animate={{ opacity: 0.95, x: 0, rotate: -6 }}
                transition={{ delay: 0.35, duration: 0.7, ease: "easeOut" }}
                src="https://placehold.co/220x300/1a1a1a/8a6d3b?text=%20"
                alt=""
                className="w-24 sm:w-28 aspect-[3/4] object-cover border border-white/20 shadow-2xl backdrop-blur-sm"
              />
              <motion.img
                initial={{ opacity: 0, x: 24, rotate: 5 }}
                animate={{ opacity: 0.95, x: 0, rotate: 5 }}
                transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
                src="https://placehold.co/220x300/1a1a1a/8a6d3b?text=%20"
                alt=""
                className="w-24 sm:w-28 aspect-[3/4] object-cover border border-white/20 shadow-2xl mr-10 backdrop-blur-sm"
              />
            </div>

            <div className="flex flex-col relative z-10 max-w-[70%]">
              {siteContent.navbar.links.map((link, i) => {
                const active = pathname === link.path;
                return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: "easeOut" }}
                    className="border-b border-white/10 py-5 flex items-baseline gap-4"
                  >
                    <span className="text-yellow-500 text-xs tracking-widest">
                      0{i + 1}
                    </span>
                    <Link
                      href={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`font-serif text-4xl transition-colors ${
                        active ? "text-yellow-500" : "text-white"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + siteContent.navbar.links.length * 0.08, duration: 0.5 }}
              className="mt-10 relative z-10"
            >
              <motion.div whileTap={{ scale: 0.96 }} className="inline-block">
                <Link
                  href={siteContent.navbar.cta.path}
                  onClick={() => setIsOpen(false)}
                  className="group relative inline-flex items-center gap-2 px-10 py-4 rounded-full overflow-hidden backdrop-blur-md bg-white/10 border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]"
                >
                  <span className="absolute inset-0 rounded-full bg-white scale-0 group-hover:scale-100 transition-transform duration-500 origin-center" />
                  <span className="relative z-10 text-[11px] tracking-[0.3em] uppercase text-white group-hover:text-black transition-colors duration-500">
                    {siteContent.navbar.cta.text}
                  </span>
                </Link>
              </motion.div>
            </motion.div>

            <span className="absolute bottom-8 left-10 text-[10px] tracking-[0.4em] uppercase text-white/40 z-10">
              {siteContent.brand.name}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};