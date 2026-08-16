'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { navigationItems } from '@/app/lib/navigation';
import styles from './SiteNavigation.module.css';

function isCurrentPath(pathname: string, href: string) {
  return href === '/' ? pathname === href : pathname.startsWith(href);
}

function NavigationList({ pathname }: { pathname: string }) {
  return (
    <ul className={styles.links}>
      {navigationItems.map((item) => {
        const active = isCurrentPath(pathname, item.href);

        return (
          <li key={item.href}>
            <Link aria-current={active ? 'page' : undefined} href={item.href}>
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function SiteNavigation() {
  const pathname = usePathname() ?? '/';
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav aria-label="Primary navigation" className={styles.desktopNavigation}>
        <Link aria-label="Go to Home" className={styles.monogram} href="/">
          C.M.B.
        </Link>
        <div className={styles.navigationGroups}>
          <NavigationList pathname={pathname} />
        </div>
        <p className={styles.footer}>
          Jakarta, Indonesia
          <br />
          Selected work
        </p>
      </nav>

      <details
        className={styles.mobileNavigation}
        onToggle={(event) => setMenuOpen(event.currentTarget.open)}
      >
        <summary>
          <span>C.M.B.</span>
          <span>{menuOpen ? 'Close −' : 'Menu +'}</span>
        </summary>
        <nav
          aria-label="Primary navigation mobile"
          className={styles.mobilePanel}
        >
          <NavigationList pathname={pathname} />
        </nav>
      </details>
    </>
  );
}
