'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'span' | 'h1' | 'h2' | 'h3' | 'p' | 'article' | 'section';
}

export default function FadeIn({
  children,
  delay = 0,
  className,
  as = 'div',
}: FadeInProps) {
  const Component = motion[as] || motion.div;
  const clampedDelay = Math.min(delay, 0.2);

  return (
    <Component
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12px' }}
      transition={{
        duration: 0.35,
        delay: clampedDelay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </Component>
  );
}
