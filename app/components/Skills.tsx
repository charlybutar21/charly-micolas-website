import styles from './Skills.module.css';
import { portfolioData } from '../data';

export default function Skills() {
  return (
    <section id="skills" className={styles.skills}>
      <h3 className={styles.sectionTitle}>
        <span className="mono">02.</span> Technical Architecture & Skills
      </h3>
      <div className={styles.content}>
        <div className={styles.categoryGrid}>
          {portfolioData.skills.map((skillGroup, index) => (
            <article key={index} className={`glass-card ${styles.skillCategory}`}>
              <h4 className={styles.categoryTitle}>{skillGroup.category}</h4>
              <ul className={styles.skillList}>
                {skillGroup.items.map((skill, sIdx) => (
                  <li key={sIdx} className={`mono ${styles.skillItem}`}>{skill}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
