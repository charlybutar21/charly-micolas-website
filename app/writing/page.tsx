import type { Metadata } from 'next';

import PageIntro from '../components/PageIntro';
import WritingList from '../components/WritingList';

import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Writing | Charly Micolas Butarbutar',
  description: 'Personal notes by Charly Micolas Butarbutar.',
};

export default function WritingPage() {
  return (
    <div className={styles.page}>
      <PageIntro
        emphasis="in progress"
        note="Personal notes on the quiet practices behind useful, reliable software."
        number="05"
        title="Writing"
      />
      <WritingList />
    </div>
  );
}
