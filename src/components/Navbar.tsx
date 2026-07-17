"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { siteContent } from "../data/siteContent";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
      <nav
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-700 ${
          scrolled
            ? "bg-black/70 backdrop-blur-xl border-b border-yellow-600/20 py-4"
            : "bg-gradient-to-b from-black/40 via-black/10 to-transparent py-7"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12">
          {/* Brand */}
          <Link href="/" className="group flex flex-col leading-none">
            <span className="font-serif text-2xl md:text-[28px] tracking-tight text-white">
              {siteContent.brand.name}
              <span className="text-yellow-600 group-hover:tracking-widest transition-all duration-500">.</span>
            </span>
            <span className="hidden md:block text-[10px] tracking-[0.4em] uppercase text-zinc-400 mt-1">
              Est. Cinematography
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-12">
            {siteContent.navbar.links.map((link) => {
              const active = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className="relative py-1 text-[11px] tracking-[0.25em] uppercase text-zinc-300 hover:text-white transition-colors duration-300"
                >
                  <span className={active ? "text-yellow-600" : ""}>{link.name}</span>
                  <span
                    className={`absolute left-0 -bottom-0.5 h-px bg-yellow-600 transition-all duration-500 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                    style={{ width: active ? "100%" : undefined }}
                  />
                </Link>
              );
            })}

            {/* CTA */}
            <Link
              href={siteContent.navbar.cta.path}
              className="group relative inline-flex items-center gap-2 px-7 py-2.5 border border-white/25 overflow-hidden"
            >
              <span className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]" />
              <span className="relative z-10 text-[11px] tracking-[0.3em] uppercase text-white group-hover:text-black transition-colors duration-500">
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
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden relative w-10 h-10 flex items-center justify-center"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`absolute inset-0 rounded-full bg-black/60 border border-white/15 transition-opacity duration-300 ${
                isOpen ? "opacity-100" : "opacity-0"
              }`}
            />
            <div className="relative w-6 h-5 flex flex-col justify-between">
              <span
                className={`h-px bg-white transition-all duration-300 ${
                  isOpen ? "rotate-45 translate-y-[9px] w-6" : "w-6"
                }`}
              />
              <span
                className={`h-px bg-yellow-600 transition-all duration-300 ${
                  isOpen ? "opacity-0" : "w-4 self-end"
                }`}
              />
              <span
                className={`h-px bg-white transition-all duration-300 ${
                  isOpen ? "-rotate-45 -translate-y-[9px] w-6" : "w-6"
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Full-Screen Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 md:hidden bg-black/95 backdrop-blur-2xl flex flex-col justify-center px-10 overflow-hidden"
          >
            {/* Decorative placeholder photos */}
            <div className="absolute right-6 top-28 hidden sm:flex flex-col items-end gap-5 pointer-events-none">
              <motion.img
                initial={{ opacity: 0, x: 24, rotate: -6 }}
                animate={{ opacity: 0.95, x: 0, rotate: -6 }}
                transition={{ delay: 0.35, duration: 0.7, ease: "easeOut" }}
                src="https://placehold.co/220x300/1a1a1a/8a6d3b?text=%20"
                alt=""
                className="w-24 sm:w-28 aspect-[3/4] object-cover border border-white/20 shadow-2xl"
              />
              <motion.img
                initial={{ opacity: 0, x: 24, rotate: 5 }}
                animate={{ opacity: 0.95, x: 0, rotate: 5 }}
                transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
                src="https://placehold.co/220x300/1a1a1a/8a6d3b?text=%20"
                alt=""
                className="w-24 sm:w-28 aspect-[3/4] object-cover border border-white/20 shadow-2xl mr-10"
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
                    <span className="text-yellow-600 text-xs tracking-widest">
                      0{i + 1}
                    </span>
                    <Link
                      href={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`font-serif text-4xl transition-colors ${
                        active ? "text-yellow-600" : "text-white"
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
              <Link
                href={siteContent.navbar.cta.path}
                onClick={() => setIsOpen(false)}
                className="group relative inline-flex items-center gap-2 px-10 py-4 border border-white/25 overflow-hidden"
              >
                <span className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                <span className="relative z-10 text-[11px] tracking-[0.3em] uppercase text-white group-hover:text-black transition-colors duration-500">
                  {siteContent.navbar.cta.text}
                </span>
              </Link>
            </motion.div>

            <span className="absolute bottom-8 left-10 text-[10px] tracking-[0.4em] uppercase text-zinc-500">
              {siteContent.brand.name}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};