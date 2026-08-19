'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'span' | 'h1' | 'h2' | 'h3' | 'p' | 'article' | 'section';
}

export default function FadeIn({ children, delay = 0, className, as = 'div' }: FadeInProps) {
  const Component = motion[as] || motion.div;

  return (
    <Component
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.25, 0.8, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </Component>
  );
}
