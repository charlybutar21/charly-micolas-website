export interface NavigationItem {
  label: string;
  href: string;
}

export const navigationItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Experience', href: '/experiences' },
  { label: 'Writing', href: '/writing' },
  { label: 'Contact', href: '/contact' },
] as const satisfies readonly NavigationItem[];
