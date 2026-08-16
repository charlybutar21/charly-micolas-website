import { portfolioData } from '../data';
import styles from './ExperienceTimeline.module.css';

export default function ExperienceTimeline() {
  return (
    <ol className={styles.timeline}>
      {portfolioData.experience.map((experience, index) => (
        <li className={styles.entry} key={`${experience.company}-${experience.period}`}>
          <article>
            <div className={styles.dateRail}>
              <p>{experience.period}</p>
              {index === 0 ? <span>Current role</span> : null}
            </div>
            <div className={styles.details}>
              <header>
                <h2>{experience.role}</h2>
                <p>{experience.company} · {experience.location}</p>
              </header>
              <ul>
                {experience.description.map((description) => (
                  <li key={description}>{description}</li>
                ))}
              </ul>
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}
