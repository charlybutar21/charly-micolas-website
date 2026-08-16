import { FaGithub, FaLinkedinIn } from 'react-icons/fa6';
import { portfolioData } from '@/app/data';
import styles from './SocialProfileLinks.module.css';

type SocialProfilePlacement = 'header' | 'contact';

const socialProfiles = [
  {
    href: portfolioData.contact.linkedin,
    icon: FaLinkedinIn,
    label: 'Open Charly Micolas LinkedIn profile',
  },
  {
    href: portfolioData.contact.github,
    icon: FaGithub,
    label: 'Open Charly Micolas GitHub profile',
  },
] as const;

export default function SocialProfileLinks({
  placement,
}: {
  placement: SocialProfilePlacement;
}) {
  return (
    <div className={`${styles.profiles} ${styles[placement]}`}>
      {socialProfiles.map(({ href, icon: Icon, label }) => (
        <a
          aria-label={label}
          href={href}
          key={href}
          rel="noopener noreferrer"
          target="_blank"
          title={label}
        >
          <Icon aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
