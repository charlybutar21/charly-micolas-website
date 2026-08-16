import Link from 'next/link';

import { portfolioData } from './data';
import styles from './page.module.css';

export default function Home() {
  return (
    <section className={styles.home}>
      <div className={styles.meta}>
        <span>Independent portfolio</span>
        <span>Software engineering · systems · people</span>
      </div>
      <div className={styles.hero}>
        <h1 aria-label={portfolioData.hero.name}>
          Charly Micolas
          <span>Butarbutar</span>
        </h1>
        <div className={styles.introduction}>
          <strong>{portfolioData.hero.role}</strong>I help teams turn complex
          problems into reliable, human-centered software through engineering
          depth, clear decisions, and thoughtful collaboration.
          <ul className={styles.evidence}>
            <li>Nearly a decade in backend engineering</li>
            <li>Fintech, PropTech, and SaaS</li>
            <li>Technical leadership and delivery ownership</li>
          </ul>
          <Link className={styles.experienceLink} href="/experiences">
            Explore experience <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
      <div className={styles.footer}>
        <p>A personal journal of work, craft, and continuing learning.</p>
        <p>Built around systems, craft, and people.</p>
      </div>
    </section>
  );
}
