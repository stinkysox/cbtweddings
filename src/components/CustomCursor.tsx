"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export const CustomCursor: React.FC = () => {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth, elegant trail configuration
  const springConfig = { damping: 28, stiffness: 250 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Robust check for touch pointers or small mobile/tablet viewports
    const isMobileDevice = 
      window.matchMedia("(pointer: coarse)").matches || 
      window.innerWidth < 1024;

    if (isMobileDevice) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Triggers scale-up on any interactive or visual element uniformally
      const interactiveTarget = target.closest("a, button, .magnetic-target, img, .gallery-item");
      setIsHovered(!!interactiveTarget);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Precision Center Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-yellow-600 rounded-full pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      
      {/* Fluid Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 border border-yellow-600/40 rounded-full pointer-events-none z-[9998]"
        animate={{
          width: isHovered ? 50 : 24,
          height: isHovered ? 50 : 24,
          backgroundColor: isHovered ? "rgba(202, 138, 4, 0.05)" : "transparent",
        }}
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      />
    </>
  );
};