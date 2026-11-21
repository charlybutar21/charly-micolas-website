import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import FadeIn from '@/app/components/shared/FadeIn';
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
        note="Backend engineering, technical leadership, and dependable delivery."
        eyebrow="Profile"
        title="About"
      />

      <div className={styles.overview}>
        <section className={styles.profileSidebar}>
          <div className={styles.profileCard}>
            <FadeIn delay={0.05} className={styles.imageWrapper}>
              <Image
                src="/images/charly.png"
                alt="Charly Micolas Butarbutar"
                width={200}
                height={200}
                className={styles.profileImage}
                priority
                unoptimized
              />
            </FadeIn>
            <FadeIn delay={0.08} className={styles.profileInfo}>
              <h2 className={styles.name}>{portfolioData.hero.name}</h2>
              <p className={styles.role}>
                Senior Software Engineer | Backend Engineering | Technical
                Leadership
              </p>
              <p className={styles.location}>South Jakarta, Indonesia</p>
            </FadeIn>
          </div>

          <FadeIn delay={0.12} className={styles.quickLinks}>
            <Link href="/experiences" className={styles.quickLink}>
              Experience &amp; skills <span aria-hidden="true">→</span>
            </Link>
            <Link href="/writing" className={styles.quickLink}>
              Writing &amp; guides <span aria-hidden="true">→</span>
            </Link>
            <Link href="/contact" className={styles.quickLink}>
              Get in touch <span aria-hidden="true">→</span>
            </Link>
          </FadeIn>
        </section>

        <div className={styles.supportingInfo}>
          <section className={styles.bio}>
            {portfolioData.about.paragraphs.map((paragraph, idx) => (
              <FadeIn delay={0.1 + idx * 0.05} key={idx} as="p">
                {paragraph}
              </FadeIn>
            ))}
          </section>

          <FadeIn delay={0.15} className={styles.education}>
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
