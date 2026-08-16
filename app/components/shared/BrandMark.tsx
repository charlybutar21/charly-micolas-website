import styles from './BrandMark.module.css';

interface BrandMarkProps {
  className?: string;
}

export default function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={[styles.mark, className].filter(Boolean).join(' ')}
      focusable="false"
      viewBox="0 0 48 48"
    >
      <circle className={styles.ring} cx="24" cy="24" r="22" />
      <text className={`${styles.letter} ${styles.letterC}`} x="7" y="31">
        C
      </text>
      <text className={`${styles.letter} ${styles.letterM}`} x="18" y="28">
        M
      </text>
      <text className={`${styles.letter} ${styles.letterB}`} x="31" y="31">
        B
      </text>
    </svg>
  );
}
