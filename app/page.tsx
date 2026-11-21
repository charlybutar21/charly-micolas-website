import Link from 'next/link';
import Image from 'next/image';
import FadeIn from '@/app/components/shared/FadeIn';
import { portfolioData } from '@/app/data';
import { SITE_ALTERNATE_NAMES, SITE_NAME, SITE_URL } from '@/app/lib/site';
import styles from './page.module.css';

const structuredData = JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAMES,
      publisher: { '@id': `${SITE_URL}/#person` },
    },
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAMES,
      url: `${SITE_URL}/`,
      image: `${SITE_URL}/images/charly.png`,
      jobTitle: portfolioData.hero.role,
      sameAs: [portfolioData.contact.linkedin, portfolioData.contact.github],
    },
  ],
}).replace(/</g, '\\u003c');

export default function Home() {
  const latestRole = portfolioData.experience[0];

  return (
    <section className={styles.home}>
      <div className={styles.meta}>
        <FadeIn delay={0.05} as="span">
          Independent portfolio
        </FadeIn>
        <FadeIn delay={0.05} as="span">
          Software engineering · systems · people
        </FadeIn>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />

      <div className={styles.hero}>
        <div className={styles.headline}>
          <p className={styles.greeting}>Hello, I’m Charly.</p>
          <FadeIn as="h1" aria-label={portfolioData.hero.name}>
            Charly Micolas
            <span>Butarbutar</span>
          </FadeIn>
          <FadeIn delay={0.08} className={styles.heroActions}>
            <Link href="/experiences" className={styles.primaryAction}>
              Explore experience <span aria-hidden="true">→</span>
            </Link>
            <Link href="/contact" className={styles.secondaryAction}>
              Get in touch
            </Link>
          </FadeIn>
        </div>

        <FadeIn delay={0.12} className={styles.introduction}>
          <div className={styles.portraitNote}>
            <Image
              src="/images/charly.png"
              alt="Charly Micolas Butarbutar"
              width={112}
              height={128}
              className={styles.portrait}
              priority
              unoptimized
            />
            <p>
              Based in South Jakarta.
              <br />
              <span>Building with people, for people.</span>
            </p>
          </div>
          <strong>{portfolioData.hero.role}</strong>
          <p className={styles.lead}>
            I help teams turn complex problems into reliable software with clear
            decisions and thoughtful collaboration.
          </p>
          <ul className={styles.evidence}>
            <li>Nearly a decade in backend engineering</li>
            <li>Fintech, PropTech, and SaaS</li>
            <li>Technical leadership and delivery ownership</li>
          </ul>
        </FadeIn>
      </div>

      <div className={styles.quickOverview}>
        <FadeIn delay={0.14} className={styles.overviewSection}>
          <h2>About</h2>
          <h3>A person behind the systems.</h3>
          <p>
            I’m Charly Micolas Butarbutar (Charly Butarbutar / Charly Micolas),
            a backend engineer building Java &amp; Go systems in South Jakarta.
          </p>
          <Link href="/about" className={styles.textLink}>
            Read full profile <span aria-hidden="true">→</span>
          </Link>
        </FadeIn>

        <FadeIn delay={0.16} className={styles.overviewSection}>
          <h2>Latest Role</h2>
          <h3>{latestRole.role}</h3>
          <p>
            {latestRole.company} · {latestRole.period}
          </p>
          <Link href="/experiences" className={styles.textLink}>
            View all experiences <span aria-hidden="true">→</span>
          </Link>
        </FadeIn>

        <FadeIn delay={0.18} className={styles.overviewSection}>
          <h2>Technical Toolkit</h2>
          <h3>
            Java &amp; Go.
            <br />
            <em>And the bigger picture.</em>
          </h3>
          <p>
            Java, Go, Spring Boot, PostgreSQL, Redis, Apache Kafka, and Docker.
          </p>
          <Link
            href="/experiences#technical-toolkit"
            className={styles.textLink}
          >
            Browse technical toolkit <span aria-hidden="true">→</span>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
