import { portfolioData } from '@/app/data';
import SocialProfileLinks from './SocialProfileLinks';
import styles from './ContactLinks.module.css';

export default function ContactLinks() {
  const { email } = portfolioData.contact;

  return (
    <div className={styles.links}>
      <a className={styles.email} href={`mailto:${email}`}>
        {email}
      </a>
      <SocialProfileLinks placement="contact" />
    </div>
  );
}
