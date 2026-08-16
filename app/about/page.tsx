import type { Metadata } from 'next';
import PageIntro from '../components/PageIntro';
import { portfolioData } from '../data';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About | Charly Micolas Butarbutar',
};

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <PageIntro
        emphasis="the work"
        note="A backend-focused engineering profile shaped by delivery ownership, technical leadership, and thoughtful collaboration."
        number="02"
        title="About"
      />
      <section className={styles.profile}>
        <p>{portfolioData.about.paragraphs[0]}</p>
      </section>
      <section className={styles.index}>
        <h2>Core competencies</h2>
        <ol>
          {portfolioData.coreCompetencies.map((competency, index) => (
            <li key={competency}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {competency}
            </li>
          ))}
        </ol>
      </section>
      <section className={styles.education}>
        <h2>Education</h2>
        {portfolioData.education.map((education) => (
          <article key={education.institution}>
            <p>{education.graduationDate}</p>
            <div>
              <h3>{education.degree}</h3>
              <p>{education.institution} · {education.location}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
