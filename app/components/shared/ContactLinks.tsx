import SocialProfileLinks from './SocialProfileLinks';
import styles from './ContactLinks.module.css';

export default function ContactLinks() {
  return (
    <div className={styles.links}>
      <SocialProfileLinks placement="contact" />
    </div>
  );
}
