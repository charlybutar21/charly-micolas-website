import type { ReactNode } from 'react';
import SiteNavigation from './SiteNavigation';
import styles from './SiteShell.module.css';

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <SiteNavigation />
      <main className={styles.content} id="main-content">
        {children}
      </main>
    </div>
  );
}
