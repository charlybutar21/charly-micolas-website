import { portfolioData } from '@/app/data';
import styles from './ExperienceTimeline.module.css';

export default function ExperienceTimeline() {
  return (
    <ol className={styles.timeline}>
      {portfolioData.experience.map((experience, index) => (
        <li
          className={styles.entry}
          key={`${experience.company}-${experience.period}`}
        >
          <article>
            <div className={styles.dateRail}>
              <p>{experience.period}</p>
              {index === 0 ? <span>Current role</span> : null}
            </div>
            <div className={styles.details}>
              <header>
                <h2>{experience.role}</h2>
                <p>
                  {experience.company} · {experience.location}
                </p>
              </header>
              <ul className={styles.highlights}>
                {experience.highlights.map((responsibility) => (
                  <li key={responsibility}>{responsibility}</li>
                ))}
              </ul>
              {experience.additionalResponsibilities.length > 0 ? (
                <details className={styles.more}>
                  <summary>More responsibilities</summary>
                  <ul>
                    {experience.additionalResponsibilities.map(
                      (responsibility) => (
                        <li key={responsibility}>{responsibility}</li>
                      ),
                    )}
                  </ul>
                </details>
              ) : null}
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}
