import { portfolioData } from '../data';
import styles from './CoreCompetencies.module.css';

export default function CoreCompetencies() {
  return (
    <section id="competencies" className={styles.competencies}>
      <h3 className={styles.sectionTitle}>
        <span className="mono">02.</span> Core Competencies
      </h3>
      <div className={`glass-card ${styles.content}`}>
        <ul className={styles.list}>
          {portfolioData.coreCompetencies.map((competency) => (
            <li key={competency} className={`mono ${styles.item}`}>
              {competency}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
