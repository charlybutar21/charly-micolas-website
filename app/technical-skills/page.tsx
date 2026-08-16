import type { Metadata } from 'next';
import SkillIndex from '@/app/components/portfolio/SkillIndex';
import PageIntro from '@/app/components/shared/PageIntro';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Technical Skills | Charly Micolas Butarbutar',
  description:
    'Technical toolkit of Charly Micolas Butarbutar across backend engineering, service integration, and software delivery.',
  alternates: {
    canonical: '/technical-skills',
  },
};

export default function TechnicalSkillsPage() {
  return (
    <div className={styles.page}>
      <PageIntro
        emphasis="skills"
        note="A visual index of the tools, platforms, and engineering practices used to build and sustain backend systems."
        eyebrow="Technical practice"
        title="Technical"
      />
      <p className={styles.context}>
        Professional toolkit used across backend delivery, service integration,
        and engineering practice.
      </p>
      <SkillIndex />
    </div>
  );
}
