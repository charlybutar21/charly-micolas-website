import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.logo}>
          <Link href="/">CB.</Link>
        </div>
        <ul className={styles.navLinks}>
          <li><Link href="#about">About Me</Link></li>
          <li><Link href="#skills">Technical Skills</Link></li>
          <li><Link href="#experience">View My Work</Link></li>
          <li><Link href="#contact">Get In Touch</Link></li>
        </ul>
      </div>
    </nav>
  );
}
