import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { portfolioData } from '../../data';

import styles from './page.module.css';

interface WritingPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return portfolioData.writing.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: WritingPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = portfolioData.writing.find((item) => item.slug === slug);

  return post
    ? {
        title: `${post.title} | Charly Micolas Butarbutar`,
        description: post.excerpt,
        alternates: {
          canonical: `/writing/${post.slug}`,
        },
      }
    : {};
}

export default async function WritingPostPage({
  params,
}: WritingPostPageProps) {
  const { slug } = await params;
  const post = portfolioData.writing.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <article className={styles.article}>
        <Link href="/writing" className={styles.backLink}>
          <span aria-hidden="true">←</span> Back to writing
        </Link>

        <header className={styles.header}>
          <p className={styles.eyebrow}>Personal notes</p>
          <p className={styles.meta}>
            <span>{post.status === 'Draft' ? 'Draft note' : post.status}</span>
            <span>{post.publishedOn}</span>
            <span>{post.readingTime}</span>
          </p>
          <h1>{post.title}</h1>
          <p className={styles.excerpt}>{post.excerpt}</p>
        </header>

        <div className={styles.body}>
          {post.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        {post.sections && post.sections.length > 0 ? (
          <>
            <nav aria-label="Article chapters" className={styles.toc}>
              <p className={styles.tocTitle}>In this guide</p>
              <ol className={styles.tocList}>
                {post.sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>{section.title}</a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className={styles.sections}>
              {post.sections.map((section) => (
                <section
                  className={styles.section}
                  id={section.id}
                  key={section.id}
                >
                  {section.eyebrow ? (
                    <p className={styles.sectionEyebrow}>{section.eyebrow}</p>
                  ) : null}
                  <h2>{section.title}</h2>
                  <div className={styles.sectionParagraphs}>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>

                  {section.highlights && section.highlights.length > 0 ? (
                    <dl className={styles.highlights}>
                      {section.highlights.map((item) => (
                        <div className={styles.highlightCard} key={item.label}>
                          <dt>{item.label}</dt>
                          <dd>{item.detail}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}

                  {section.callout ? (
                    <aside className={styles.callout} aria-label="Key takeaway">
                      <p>{section.callout}</p>
                    </aside>
                  ) : null}
                </section>
              ))}
            </div>
          </>
        ) : null}

        {post.externalResource ? (
          <footer className={styles.resourceCard}>
            <div>
              <p className={styles.resourceEyebrow}>Source &amp; deep dive</p>
              <a
                className={styles.resourceLink}
                href={post.externalResource.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                {post.externalResource.label} <span aria-hidden="true">↗</span>
              </a>
              {post.externalResource.note ? (
                <p className={styles.resourceNote}>
                  {post.externalResource.note}
                </p>
              ) : null}
            </div>
          </footer>
        ) : null}
      </article>
    </div>
  );
}
