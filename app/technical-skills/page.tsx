import type { Metadata } from 'next';
import PageIntro from '../components/PageIntro';
import SkillIndex from '../components/SkillIndex';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Technical Skills | Charly Micolas Butarbutar',
};

export default function TechnicalSkillsPage() {
  return (
    <div className={styles.page}>
      <PageIntro
        emphasis="skills"
        note="A visual index of the tools, platforms, and engineering practices used to build and sustain backend systems."
        number="03"
        title="Technical"
      />
      <SkillIndex />
    </div>
  );
}
