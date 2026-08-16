import styles from './Contact.module.css';
import { portfolioData } from '../data';

export default function Contact() {
  const { email, phone, linkedin, github } = portfolioData.contact;
  return (
    <section id="contact" className={styles.contact}>
      <div className={`glass-card ${styles.contactCard}`}>
        <h3 className={styles.sectionTitle}>
          <span className="mono">06.</span> Get In Touch
        </h3>
        <h4 className={styles.title}>Get In Touch</h4>
        <p className={styles.text}>
          Connect with me through email, phone, LinkedIn, or GitHub.
        </p>
        <div className={styles.links}>
          <a href={`mailto:${email}`} className={styles.primaryButton}>
            Say Hello
          </a>
          <a
            href={`tel:${phone.replace(/[^\d+]/g, '')}`}
            className={styles.secondaryButton}
          >
            {phone}
          </a>
          <div className={styles.socials}>
            <a href={linkedin} target="_blank" rel="noreferrer" className={styles.socialLink}>
              LinkedIn
            </a>
            <a href={github} target="_blank" rel="noreferrer" className={styles.socialLink}>
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
