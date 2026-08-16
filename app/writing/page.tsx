import type { Metadata } from 'next';

import WritingList from '@/app/components/portfolio/WritingList';
import PageIntro from '@/app/components/shared/PageIntro';

import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Writing | Charly Micolas Butarbutar',
  description: 'Personal notes by Charly Micolas Butarbutar.',
  alternates: {
    canonical: '/writing',
  },
};

export default function WritingPage() {
  return (
    <div className={styles.page}>
      <PageIntro
        emphasis="in progress"
        note="Personal notes on the quiet practices behind useful, reliable software."
        eyebrow="Personal notes"
        title="Writing"
      />
      <WritingList />
    </div>
  );
}
