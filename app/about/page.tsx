import type { Metadata } from 'next';
import PageIntro from '@/app/components/shared/PageIntro';
import { portfolioData } from '@/app/data';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About | Charly Micolas Butarbutar',
  description:
    'Backend engineering profile of Charly Micolas Butarbutar, including leadership, delivery, and system-design strengths.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <PageIntro
        emphasis="the work"
        note="A backend-focused engineering profile shaped by delivery ownership, technical leadership, and thoughtful collaboration."
        eyebrow="Profile"
        title="About"
      />
      <div className={styles.overview}>
        <section className={styles.profile}>
          <p>{portfolioData.about.paragraphs[0]}</p>
        </section>
        <div className={styles.supportingInfo}>
          <section className={styles.index}>
            <h2>Core competencies</h2>
            <ul>
              {portfolioData.coreCompetencies.map((competency) => (
                <li key={competency}>{competency}</li>
              ))}
            </ul>
          </section>
          <section className={styles.education}>
            <h2>Education</h2>
            {portfolioData.education.map((education) => (
              <article key={education.institution}>
                <p>{education.graduationDate}</p>
                <div>
                  <h3>{education.degree}</h3>
                  <p>
                    {education.institution} · {education.location}
                  </p>
                </div>
              </article>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
