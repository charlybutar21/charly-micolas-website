import type { Metadata } from 'next';
import ExperienceTimeline from '@/app/components/portfolio/ExperienceTimeline';
import PageIntro from '@/app/components/shared/PageIntro';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Experiences | Charly Micolas Butarbutar',
};

export default function ExperiencesPage() {
  return (
    <div className={styles.page}>
      <PageIntro
        emphasis="through time"
        note="A chronological record of roles across fintech, property technology, supply-chain SaaS, and technical support."
        number="04"
        title="Work"
      />
      <ExperienceTimeline />
    </div>
  );
}
