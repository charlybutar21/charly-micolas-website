import Link from 'next/link';
import Image from 'next/image';
import FadeIn from '@/app/components/shared/FadeIn';
import { portfolioData } from './data';
import styles from './page.module.css';

export default function Home() {
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'WebSite',
                '@id': 'https://www.charlymicolas.com/#website',
                url: 'https://www.charlymicolas.com/',
                name: 'Charly Micolas Butarbutar',
                alternateName: ['Charly Butarbutar', 'Charly Micolas'],
                publisher: { '@id': 'https://www.charlymicolas.com/#person' },
              },
              {
                '@type': 'Person',
                '@id': 'https://www.charlymicolas.com/#person',
                name: 'Charly Micolas Butarbutar',
                alternateName: ['Charly Butarbutar', 'Charly Micolas'],
                url: 'https://www.charlymicolas.com/',
                image: 'https://www.charlymicolas.com/images/charly.png',
                jobTitle: 'Senior Software Engineer',
                sameAs: [
                  'https://linkedin.com/in/charly-micolas',
                  'https://github.com/charlybutar21',
                ],
              },
            ],
          }).replace(/</g, '\\u003c'),
        }}
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
          <h3>{portfolioData.experience[0].role}</h3>
          <p>
            {portfolioData.experience[0].company} ·{' '}
            {portfolioData.experience[0].period}
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
