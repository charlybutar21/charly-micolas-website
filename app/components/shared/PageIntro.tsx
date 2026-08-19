import FadeIn from './FadeIn';
import styles from './PageIntro.module.css';

interface PageIntroProps {
  eyebrow: string;
  title: string;
  emphasis?: string;
  note: string;
}

export default function PageIntro({
  eyebrow,
  title,
  emphasis,
  note,
}: PageIntroProps) {
  return (
    <header className={styles.intro}>
      <FadeIn delay={0.1} as="p" className={styles.eyebrow}>{eyebrow}</FadeIn>
      <div className={styles.content}>
        <FadeIn delay={0.2} as="h1">
          {title}
          {emphasis ? <em>{emphasis}</em> : null}
        </FadeIn>
        <FadeIn delay={0.3} as="p" className={styles.note}>{note}</FadeIn>
      </div>
    </header>
  );
}
