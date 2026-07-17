"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface SectionWrapperProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'none';
  delay?: number;
  className?: string;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({ 
  children, 
  direction = 'up', 
  delay = 0,
  className = ''
}) => {
  const variants = {
    hidden: {
      opacity: 0,
      x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
      y: direction === 'up' ? 50 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 1.2,
        delay,
        ease: [0.16, 1, 0.3, 1] as any, // Custom elegant cubic-bezier
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={variants}
      className={className}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
};
