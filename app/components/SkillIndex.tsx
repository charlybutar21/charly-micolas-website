import { portfolioData } from '../data';
import { getSkillMark } from '../lib/skill-icons';
import styles from './SkillIndex.module.css';

function SkillMark({ skill }: { skill: string }) {
  const mark = getSkillMark(skill);

  if (mark.kind === 'simple') {
    return (
      <svg
        aria-label={`${skill} logo`}
        className={styles.brandMark}
        fill={`#${mark.icon.hex}`}
        role="img"
        viewBox="0 0 24 24"
      >
        <path d={mark.icon.path} />
      </svg>
    );
  }

  if (mark.kind === 'react') {
    const Icon = mark.icon;
    return <Icon aria-label={`${skill} logo`} className={styles.brandMark} color={mark.color} role="img" />;
  }

  return (
    <span aria-label={`${skill} practice mark`} className={styles.practiceMark} role="img">
      {mark.abbreviation}
    </span>
  );
}

export default function SkillIndex() {
  return (
    <div className={styles.index}>
      {portfolioData.skills.map((group, index) => (
        <section className={styles.group} key={group.category}>
          <h2>
            <span>{String(index + 1).padStart(2, '0')} /</span>
            {group.category}
          </h2>
          <ul>
            {group.items.map((skill) => (
              <li key={skill}>
                <SkillMark skill={skill} />
                <span>{skill}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className={styles.legend}>
        <strong>Brand mark</strong> identifies named technology. <strong>Practice mark</strong> identifies a method or principle without an official product logo.
      </p>
    </div>
  );
}
