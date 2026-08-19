import Link from 'next/link';
import FadeIn from '@/app/components/shared/FadeIn';
import { portfolioData } from './data';
import styles from './page.module.css';

export default function Home() {
  return (
    <section className={styles.home}>
      <div className={styles.meta}>
        <FadeIn delay={0.1} as="span">
          Independent portfolio
        </FadeIn>
        <FadeIn delay={0.1} as="span">
          Software engineering · systems · people
        </FadeIn>
      </div>

      <div className={styles.hero}>
        <FadeIn as="h1" aria-label={portfolioData.hero.name}>
          Charly Micolas
          <span>Butarbutar</span>
        </FadeIn>
        <FadeIn delay={0.2} className={styles.introduction}>
          <strong>{portfolioData.hero.role}</strong>I help teams turn complex
          problems into reliable, human-centered software through engineering
          depth, clear decisions, and thoughtful collaboration.
          <ul className={styles.evidence}>
            <li>Nearly a decade in backend engineering</li>
            <li>Fintech, PropTech, and SaaS</li>
            <li>Technical leadership and delivery ownership</li>
          </ul>
        </FadeIn>
      </div>

      <div className={styles.quickOverview}>
        <FadeIn delay={0.3} className={styles.overviewSection}>
          <h2>About</h2>
          <p>{portfolioData.about.paragraphs[0]}</p>
          <Link href="/about" className={styles.textLink}>
            Read full profile
          </Link>
        </FadeIn>

        <FadeIn delay={0.4} className={styles.overviewSection}>
          <h2>Latest Role</h2>
          <h3>{portfolioData.experience[0].role}</h3>
          <p>
            {portfolioData.experience[0].company} ·{' '}
            {portfolioData.experience[0].period}
          </p>
          <Link href="/experiences" className={styles.textLink}>
            View all experiences
          </Link>
        </FadeIn>
      </div>

      <div className={styles.footer}>
        <p>A personal journal of work, craft, and continuing learning.</p>
        <p>Built around systems, craft, and people.</p>
      </div>
    </section>
  );
}
