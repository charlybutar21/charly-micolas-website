import styles from './Education.module.css';
import { portfolioData } from '../data';

export default function Education() {
  return (
    <section id="education" className={styles.education}>
      <h3 className={styles.sectionTitle}>
        <span className="mono">05.</span> Education
      </h3>
      <div className={styles.eduGrid}>
        {portfolioData.education.map((edu, idx) => (
          <article key={idx} className={`glass-card ${styles.eduCard}`}>
            <h4 className={styles.degree}>{edu.degree}</h4>
            <h5 className={styles.institution}>{edu.institution}</h5>
            <div className={styles.meta}>
              <span className={`mono ${styles.date}`}>{edu.graduationDate}</span>
              <span className={styles.location}>{edu.location}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
