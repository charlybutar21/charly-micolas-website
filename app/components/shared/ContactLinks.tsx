import { portfolioData } from '@/app/data';
import styles from './ContactLinks.module.css';

export default function ContactLinks() {
  const { email, github, linkedin } = portfolioData.contact;

  return (
    <div className={styles.links}>
      <a className={styles.email} href={`mailto:${email}`}>
        {email}
      </a>
      <div className={styles.socials}>
        <a
          aria-label="Open Charly Micolas LinkedIn profile"
          href={linkedin}
          rel="noopener noreferrer"
          target="_blank"
        >
          LinkedIn ↗
        </a>
        <a
          aria-label="Open Charly Micolas GitHub profile"
          href={github}
          rel="noopener noreferrer"
          target="_blank"
        >
          GitHub ↗
        </a>
      </div>
    </div>
  );
}
