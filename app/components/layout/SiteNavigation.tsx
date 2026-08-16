'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigationItems } from '@/app/lib/navigation';
import BrandMark from '../shared/BrandMark';
import SocialProfileLinks from '../shared/SocialProfileLinks';
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

  return (
    <nav aria-label="Primary navigation" className={styles.navigation}>
      <Link aria-label="Go to Home" className={styles.brandLink} href="/">
        <BrandMark className={styles.brandMark} />
      </Link>
      <div className={styles.linkViewport}>
          <NavigationList pathname={pathname} />
      </div>
      <SocialProfileLinks placement="header" />
    </nav>
  );
}
