'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigationGroups } from '../lib/navigation';
import styles from './SiteNavigation.module.css';

function isCurrentPath(pathname: string, href: string) {
  return href === '/' ? pathname === href : pathname.startsWith(href);
}

function NavigationList({ pathname }: { pathname: string }) {
  return (
    <>
      {navigationGroups.map((group) => (
        <section className={styles.group} key={group.label}>
          <p className={styles.groupLabel}>{group.label}</p>
          <ul className={styles.links}>
            {group.items.map((item) => {
              const active = isCurrentPath(pathname, item.href);

              return (
                <li key={item.href}>
                  <Link aria-current={active ? 'page' : undefined} href={item.href}>
                    <span className={styles.number}>{item.number}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </>
  );
}

export default function SiteNavigation() {
  const pathname = usePathname() ?? '/';

  return (
    <>
      <nav aria-label="Primary navigation" className={styles.desktopNavigation}>
        <Link aria-label="Go to Home" className={styles.monogram} href="/">
          C.M.B.
        </Link>
        <div className={styles.navigationGroups}>
          <NavigationList pathname={pathname} />
        </div>
        <p className={styles.footer}>Jakarta, Indonesia<br />Portfolio / 2026</p>
      </nav>

      <details className={styles.mobileNavigation}>
        <summary>
          <span>C.M.B.</span>
          <span>Menu +</span>
        </summary>
        <nav aria-label="Primary navigation mobile" className={styles.mobilePanel}>
          <NavigationList pathname={pathname} />
        </nav>
      </details>
    </>
  );
}
