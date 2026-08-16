export interface NavigationItem {
  label: string;
  href: string;
  number: string;
}

export interface NavigationGroup {
  label: string;
  items: readonly NavigationItem[];
}

export const navigationGroups = [
  {
    label: 'Start here',
    items: [
      { label: 'Home', href: '/', number: '01' },
      { label: 'About', href: '/about', number: '02' },
    ],
  },
  {
    label: 'Practice',
    items: [
      { label: 'Technical Skills', href: '/technical-skills', number: '03' },
      { label: 'Experiences', href: '/experiences', number: '04' },
    ],
  },
  {
    label: 'Notes',
    items: [{ label: 'Writing', href: '/writing', number: '05' }],
  },
  {
    label: 'Connect',
    items: [{ label: 'Contact', href: '/contact', number: '06' }],
  },
] as const satisfies readonly NavigationGroup[];
