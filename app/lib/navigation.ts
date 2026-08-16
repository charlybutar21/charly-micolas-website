export interface NavigationItem {
  label: string;
  href: string;
}

export interface NavigationGroup {
  label: string;
  items: readonly NavigationItem[];
}

export const navigationGroups = [
  {
    label: 'Start here',
    items: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
    ],
  },
  {
    label: 'Practice',
    items: [
      { label: 'Technical Skills', href: '/technical-skills' },
      { label: 'Experiences', href: '/experiences' },
    ],
  },
  {
    label: 'Notes',
    items: [{ label: 'Writing', href: '/writing' }],
  },
  {
    label: 'Connect',
    items: [{ label: 'Contact', href: '/contact' }],
  },
] as const satisfies readonly NavigationGroup[];
