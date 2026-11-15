import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import styles from './FadeIn.module.css';

interface FadeInProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  delay?: number;
  as?: 'div' | 'span' | 'h1' | 'h2' | 'h3' | 'p' | 'article' | 'section';
}

export default function FadeIn({
  children,
  delay = 0,
  className,
  as: Component = 'div',
  style,
  ...props
}: FadeInProps) {
  return (
    <Component
      {...props}
      className={[styles.reveal, className].filter(Boolean).join(' ')}
      style={
        {
          ...style,
          '--reveal-delay': `${Math.max(0, Math.min(delay, 0.2))}s`,
        } as CSSProperties
      }
    >
      {children}
    </Component>
  );
}
