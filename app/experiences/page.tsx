import type { Metadata } from 'next';
import ExperienceTimeline from '@/app/components/portfolio/ExperienceTimeline';
import SkillIndex from '@/app/components/portfolio/SkillIndex';
import PageIntro from '@/app/components/shared/PageIntro';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Experience & Skills | Charly Micolas Butarbutar',
  description:
    'Career history and technical skills of Charly Micolas Butarbutar across fintech, property technology, and supply-chain SaaS.',
  alternates: {
    canonical: '/experiences',
  },
};

export default function ExperiencesPage() {
  return (
    <div className={styles.page}>
      <PageIntro
        emphasis="& skills"
        note="A chronological record of roles and technical toolkit across fintech, property technology, and SaaS."
        eyebrow="Career & Tools"
        title="Experience"
      />
      <div className={styles.mobileJump}>
        <a href="#technical-toolkit">
          Jump to Technical Toolkit <span aria-hidden="true">↓</span>
        </a>
      </div>
      <div className={styles.sections}>
        <section aria-label="Career timeline">
          <ExperienceTimeline />
        </section>
        <section className={styles.skillsSection} id="technical-toolkit">
          <div className={styles.skillsHeader}>
            <h2 className={styles.sectionTitle}>Technical Toolkit</h2>
          </div>
          <SkillIndex compact />
        </section>
      </div>
    </div>
  );
}
