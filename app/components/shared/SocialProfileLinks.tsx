import { FaGithub, FaLinkedinIn } from 'react-icons/fa6';
import { portfolioData } from '@/app/data';
import styles from './SocialProfileLinks.module.css';

type SocialProfilePlacement = 'header' | 'contact';

const socialProfiles = [
  {
    href: portfolioData.contact.linkedin,
    icon: FaLinkedinIn,
    name: 'LinkedIn',
    description: 'Connect and start a conversation',
    label: 'Open Charly Micolas LinkedIn profile',
  },
  {
    href: portfolioData.contact.github,
    icon: FaGithub,
    name: 'GitHub',
    description: 'Explore my code and projects',
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
      {socialProfiles.map(({ href, icon: Icon, label, name, description }) => (
        <a
          aria-label={label}
          href={href}
          key={href}
          rel="noopener noreferrer"
          target="_blank"
          title={label}
        >
          <Icon aria-hidden="true" />
          {placement === 'contact' ? (
            <span className={styles.label}>
              <strong>{name}</strong>
              <span>{description}</span>
            </span>
          ) : null}
        </a>
      ))}
    </div>
  );
}
