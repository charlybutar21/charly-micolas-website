import Link from 'next/link';

import { portfolioData } from '@/app/data';

import styles from './WritingList.module.css';

export default function WritingList() {
  return (
    <section aria-label="Writing index" className={styles.list}>
      {portfolioData.writing.map((post, index) => (
        <article className={styles.post} key={post.slug}>
          <p className={styles.number}>{String(index + 1).padStart(2, '0')}</p>
          <div className={styles.content}>
            <div className={styles.meta}>
              <span>{post.status}</span>
              <span>{post.publishedOn}</span>
              <span>{post.readingTime}</span>
            </div>
            <h2>
              <Link href={`/writing/${post.slug}`}>{post.title}</Link>
            </h2>
            <p>{post.excerpt}</p>
          </div>
          <Link
            aria-label={`Read ${post.title}`}
            className={styles.read}
            href={`/writing/${post.slug}`}
          >
            Read note <span aria-hidden="true">↗</span>
          </Link>
        </article>
      ))}
    </section>
  );
}
