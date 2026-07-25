import styles from './Hero.module.css';
import { portfolioData } from '../data';

export default function Hero() {
  const { name, role, tagline } = portfolioData.hero;

  return (
    <section className={styles.hero}>
      <div className={`glass-card ${styles.heroCard}`}>
        <p className={`mono ${styles.greeting}`}>Hello, world. I am</p>
        <h1 className={styles.name}>{name}</h1>
        <h2 className={styles.role}>{role}</h2>
        <p className={styles.tagline}>{tagline}</p>
        <div className={styles.ctaContainer}>
          <a href="#experience" className={styles.primaryButton}>View My Work</a>
          <a href="#contact" className={styles.secondaryButton}>Get In Touch</a>
        </div>
      </div>
    </section>
  );
}
