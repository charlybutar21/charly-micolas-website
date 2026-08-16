import styles from './About.module.css';
import { portfolioData } from '../data';

export default function About() {
  return (
    <section id="summary" className={styles.about}>
      <h3 className={styles.sectionTitle}>
        <span className="mono">01.</span> Professional Summary
      </h3>
      <div className={`glass-card ${styles.contentWrapper}`}>
        <div className={styles.content}>
          {portfolioData.about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
