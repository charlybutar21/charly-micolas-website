import styles from './Experience.module.css';
import { portfolioData } from '../data';

export default function Experience() {
  return (
    <section id="experience" className={styles.experience}>
      <h3 className={styles.sectionTitle}>
        <span className="mono">03.</span> Where I&apos;ve Worked
      </h3>
      <div className={styles.jobs}>
        {portfolioData.experience.map((job, idx) => (
          <article key={idx} className={`glass-card ${styles.jobCard}`}>
            <div className={styles.jobHeader}>
              <h4 className={styles.role}>
                {job.role} <span className={styles.company}>@ {job.company}</span>
              </h4>
              <p className={`mono ${styles.date}`}>{job.period}</p>
            </div>
            <ul className={styles.taskList}>
              {job.description.map((task, tIdx) => (
                <li key={tIdx}>{task}</li>
              ))}
            </ul>
            <div className={styles.jobSkills}>
              {job.skills.map((skill, sIdx) => (
                <span key={sIdx} className={styles.skillBadge}>{skill}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
