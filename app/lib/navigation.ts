export interface NavigationItem {
  label: string;
  href: string;
}

export const navigationItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Technical Skills', href: '/technical-skills' },
  { label: 'Experiences', href: '/experiences' },
  { label: 'Writing', href: '/writing' },
  { label: 'Contact', href: '/contact' },
] as const satisfies readonly NavigationItem[];
