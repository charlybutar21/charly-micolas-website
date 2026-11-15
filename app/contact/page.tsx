import type { Metadata } from 'next';
import Link from 'next/link';
import ContactLinks from '@/app/components/shared/ContactLinks';
import FadeIn from '@/app/components/shared/FadeIn';
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
      <div className={styles.grid}>
        <FadeIn delay={0.08} as="section" className={styles.contact}>
          <p className={styles.headline}>
            Connect with me on LinkedIn or explore my work on GitHub.
          </p>
          <ContactLinks />
          <dl className={styles.details}>
            <div>
              <dt>Location</dt>
              <dd>South Jakarta, Indonesia (UTC+7)</dd>
            </div>
            <div>
              <dt>Focus</dt>
              <dd>
                Backend architecture, Java &amp; Go systems, technical
                leadership
              </dd>
            </div>
          </dl>
        </FadeIn>

        <FadeIn delay={0.12} className={styles.exploreCard}>
          <h2>Explore further</h2>
          <ul>
            <li>
              <Link href="/about">
                <span>Profile &amp; Education</span>
                <span aria-hidden="true">→</span>
              </Link>
            </li>
            <li>
              <Link href="/experiences">
                <span>Experience Timeline</span>
                <span aria-hidden="true">→</span>
              </Link>
            </li>
            <li>
              <Link href="/technical-skills">
                <span>Technical Toolkit</span>
                <span aria-hidden="true">→</span>
              </Link>
            </li>
            <li>
              <Link href="/writing">
                <span>Personal Notes</span>
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          </ul>
        </FadeIn>
      </div>
    </div>
  );
}
