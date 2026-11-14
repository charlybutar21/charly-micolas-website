import type { Metadata } from 'next';
import ContactLinks from '@/app/components/shared/ContactLinks';
import PageIntro from '@/app/components/shared/PageIntro';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Contact | Charly Micolas Butarbutar',
  description:
    'Contact Charly Micolas Butarbutar for engineering conversations, opportunities, and professional collaboration.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <PageIntro
        emphasis="a note"
        note="For engineering conversations, opportunities, or a thoughtful exchange about building dependable systems."
        eyebrow="Get in touch"
        title="Send"
      />
      <section className={styles.contact}>
        <p>Connect with me on LinkedIn or explore my work on GitHub.</p>
        <ContactLinks />
      </section>
    </div>
  );
}
