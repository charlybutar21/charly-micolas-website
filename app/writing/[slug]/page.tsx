import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { portfolioData } from '@/app/data';
import { formatWritingStatus, SITE_NAME } from '@/app/lib/site';
import type {
  WritingExternalResource,
  WritingPost,
  WritingSection,
} from '@/app/types';
import styles from './page.module.css';

interface WritingPostPageProps {
  params: Promise<{ slug: string }>;
}

function findWritingPost(slug: string): WritingPost | undefined {
  return portfolioData.writing.find((item) => item.slug === slug);
}

function ArticleSection({ section }: { section: WritingSection }) {
  return (
    <section className={styles.section} id={section.id}>
      {section.eyebrow ? (
        <p className={styles.sectionEyebrow}>{section.eyebrow}</p>
      ) : null}
      <h2>{section.title}</h2>
      <div className={styles.sectionParagraphs}>
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      {section.analogy ? (
        <aside aria-label={section.analogy.title} className={styles.analogyBox}>
          <p className={styles.analogyTitle}>{section.analogy.title}</p>
          <p className={styles.analogyText}>{section.analogy.text}</p>
        </aside>
      ) : null}

      {section.example ? (
        <div className={styles.exampleBox}>
          <h3 className={styles.exampleTitle}>{section.example.title}</h3>
          {section.example.description ? (
            <p className={styles.exampleDescription}>
              {section.example.description}
            </p>
          ) : null}
          {section.example.steps && section.example.steps.length > 0 ? (
            <ul className={styles.exampleSteps}>
              {section.example.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          ) : null}
          {section.example.code ? (
            <pre className={styles.codeBlock}>
              <code>{section.example.code}</code>
            </pre>
          ) : null}
        </div>
      ) : null}

      {section.table ? (
        <div className={styles.tableWrapper}>
          <table className={styles.comparisonTable}>
            <caption>{section.table.caption}</caption>
            <thead>
              <tr>
                {section.table.headers.map((header) => (
                  <th key={header} scope="col">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, cellIndex) => (
                    <td key={`${row[0]}-${cellIndex}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

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
  );
}

function ExternalResourceCard({
  resource,
}: {
  resource: WritingExternalResource;
}) {
  const displayUrl = resource.url.replace(/^https?:\/\//, '');

  return (
    <footer className={styles.resourceCard}>
      <div>
        <p className={styles.resourceEyebrow}>
          Full Open-Source Repository &amp; Deep Dive
        </p>
        <h2 className={styles.resourceHeading}>
          <a
            className={styles.resourceLink}
            href={resource.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            {resource.label} <span aria-hidden="true">↗</span>
          </a>
        </h2>
        {resource.note ? (
          <p className={styles.resourceNote}>{resource.note}</p>
        ) : null}
        {resource.highlights && resource.highlights.length > 0 ? (
          <ul className={styles.resourceHighlights}>
            {resource.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
        <a
          className={styles.resourceButton}
          href={resource.url}
          rel="noopener noreferrer"
          target="_blank"
        >
          Open {displayUrl} <span aria-hidden="true">↗</span>
        </a>
      </div>
    </footer>
  );
}

export async function generateStaticParams() {
  return portfolioData.writing.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: WritingPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = findWritingPost(slug);

  return post
    ? {
        title: `${post.title} | ${SITE_NAME}`,
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
  const post = findWritingPost(slug);

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
            <span>{formatWritingStatus(post.status)}</span>
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
                <ArticleSection key={section.id} section={section} />
              ))}
            </div>
          </>
        ) : null}

        {post.externalResource ? (
          <ExternalResourceCard resource={post.externalResource} />
        ) : null}
      </article>
    </div>
  );
}
