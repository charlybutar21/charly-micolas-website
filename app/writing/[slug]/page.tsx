import type { Metadata } from 'next';
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
    <article className={styles.article}>
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
    </article>
  );
}
