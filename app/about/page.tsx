import type { Metadata } from 'next';
import Image from 'next/image';
import FadeIn from '@/app/components/shared/FadeIn';
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
      <div className={styles.header}>
        <FadeIn as="h1" className={styles.title}>
          About
        </FadeIn>
        <FadeIn
          as="div"
          className={styles.titleShadow}
          delay={0.1}
          aria-hidden="true"
        >
          About
        </FadeIn>
      </div>

      <div className={styles.overview}>
        <section className={styles.profileSidebar}>
          <FadeIn delay={0.2} className={styles.imageWrapper}>
            <Image
              src="/images/charly.png"
              alt="Charly Micolas Butarbutar"
              width={200}
              height={200}
              className={styles.profileImage}
              priority
            />
          </FadeIn>
          <FadeIn delay={0.3} className={styles.profileInfo}>
            <h2 className={styles.name}>{portfolioData.hero.name}</h2>
            <p className={styles.role}>
              Senior Backend Engineer · Technical Lead
            </p>
            <p className={styles.location}>Batam, Riau Islands, Indonesia</p>
          </FadeIn>
        </section>

        <div className={styles.supportingInfo}>
          <section className={styles.bio}>
            {portfolioData.about.paragraphs.map((paragraph, idx) => (
              <FadeIn delay={0.4 + idx * 0.1} key={idx} as="p">
                {paragraph}
              </FadeIn>
            ))}
          </section>

          <FadeIn delay={0.5} className={styles.index}>
            <h2>Core competencies</h2>
            <ul>
              {portfolioData.coreCompetencies.map((competency) => (
                <li key={competency}>{competency}</li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.6} className={styles.education}>
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
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
