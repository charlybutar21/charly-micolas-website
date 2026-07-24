import styles from './Contact.module.css';
import { portfolioData } from '../data';

export default function Contact() {
  const { email, linkedin, github } = portfolioData.contact;
  return (
    <section id="contact" className={styles.contact}>
      <h3 className={styles.sectionTitle}>
        <span className="mono">05.</span> What&apos;s Next?
      </h3>
      <h4 className={styles.title}>Get In Touch</h4>
      <p className={styles.text}>
        Currently open to new opportunities. Whether you have a question, a project idea, 
        or just want to discuss backend architecture, my inbox is always open!
      </p>
      <div className={styles.links}>
        <a href={`mailto:${email}`} className={styles.primaryButton}>
          Say Hello
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
    </section>
  );
}
