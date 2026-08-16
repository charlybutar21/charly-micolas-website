import type { Metadata } from 'next';
import ContactLinks from '../components/ContactLinks';
import PageIntro from '../components/PageIntro';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Contact | Charly Micolas Butarbutar',
};

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <PageIntro
        emphasis="a note"
        note="For engineering conversations, opportunities, or a thoughtful exchange about building dependable systems."
        number="06"
        title="Send"
      />
      <section className={styles.contact}>
        <p>The easiest way to start is an email. You can also find me on the professional platforms below.</p>
        <ContactLinks />
      </section>
    </div>
  );
}
