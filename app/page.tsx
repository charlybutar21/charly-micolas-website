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
        <p className={styles.introduction}>
          <strong>{portfolioData.hero.role}</strong>
          I help teams turn complex problems into reliable, human-centered software through engineering depth, clear decisions, and thoughtful collaboration.
        </p>
      </div>
      <div className={styles.footer}>
        <p>A personal journal of work, craft, and continuing learning.</p>
        <p>01 / Home</p>
      </div>
    </section>
  );
}
