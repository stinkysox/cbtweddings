"use client";

import React, { useState, useEffect, useMemo } from "react";
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
    setScrolled(latest > 20);
  });

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navigationLinks = useMemo(() => {
    const rawLinks = siteContent.navbar?.links || [];
    const baseLinks = rawLinks.filter(
      (l) => !["contact", "wedding"].includes(l.name.toLowerCase())
    );
    const wedding = rawLinks.find((l) => l.name.toLowerCase() === "wedding");
    const contact = rawLinks.find((l) => l.name.toLowerCase() === "contact");

    return [
      ...baseLinks,
      ...(wedding ? [wedding] : []),
      ...(contact ? [contact] : []),
    ];
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[60] px-6 md:px-12 pt-6 transition-all duration-500">
        <div
          className={`max-w-7xl mx-auto flex items-center justify-between rounded-full px-6 md:px-10 transition-all duration-500 border border-white/10 backdrop-blur-xl bg-black/20 shadow-sm ${
            scrolled ? "py-3 bg-black/50 border-white/10" : "py-5"
          }`}
        >
          {/* Brand Identity */}
          <Link href="/" className="group flex flex-col leading-none z-10">
            <span className="font-serif text-xl md:text-2xl tracking-tight text-white transition-colors duration-300 group-hover:text-white/80">
              {siteContent.brand.name}
              <span className="text-yellow-500">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 z-10">
            {navigationLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`relative px-5 py-2 text-[10px] tracking-[0.25em] uppercase font-semibold transition-colors duration-300 ${
                    isActive ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  {isActive && (
                    <motion.span
                      layoutId="active-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-yellow-500"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* CTA Button */}
            <div className="ml-4 pl-4 border-l border-white/10">
              <Link
                href={siteContent.navbar.cta.path}
                className="group inline-flex items-center gap-3 px-6 py-2.5 rounded-full text-[10px] tracking-[0.25em] uppercase font-bold border border-white/20 bg-white/5 text-white transition-all duration-300 hover:bg-white hover:text-black"
              >
                <span>{siteContent.navbar.cta.text}</span>
                <svg
                  className="w-3 h-3 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300"
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

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden w-8 h-8 flex flex-col justify-center items-center gap-1.5 z-10 relative"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
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

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-50 md:hidden bg-black/95 backdrop-blur-2xl flex flex-col justify-between pt-36 pb-12 px-8 overflow-hidden"
          >
            <div className="flex flex-col gap-2 max-w-xl">
              {navigationLinks.map((link, index) => {
                const isActive = pathname === link.path;
                return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
                    className="border-b border-white/10 py-4 flex items-baseline gap-4"
                  >
                    <span className="text-white/30 text-[10px] font-mono tracking-widest">
                      0{index + 1}
                    </span>
                    <Link
                      href={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`font-serif text-3xl tracking-tight transition-colors ${
                        isActive ? "text-yellow-500" : "text-white hover:text-white/70"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navigationLinks.length * 0.05 + 0.1 }}
              className="flex flex-col gap-8 items-start w-full"
            >
              <Link
                href={siteContent.navbar.cta.path}
                onClick={() => setIsOpen(false)}
                className="w-full text-center px-8 py-4 rounded-full text-[10px] tracking-[0.3em] uppercase font-bold border border-white/20 bg-white/10 text-white active:bg-white active:text-black transition-all"
              >
                {siteContent.navbar.cta.text}
              </Link>

              <span className="text-[9px] tracking-[0.4em] uppercase text-white/30 font-medium">
                © {new Date().getFullYear()} {siteContent.brand.name}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};