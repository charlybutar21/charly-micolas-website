import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import SkillIndex from '../app/components/portfolio/SkillIndex';

it('renders sampled CV skills with visual marks and text labels', () => {
  const markup = renderToStaticMarkup(<SkillIndex />);

  for (const skill of [
    'Java',
    'Go',
    'Spring Boot',
    'Apache Kafka',
    'Docker',
    'Jira',
    'System Design',
    'Clean Code',
    'Kanban',
  ]) {
    expect(markup).toContain(skill);
  }

  expect(markup).toContain('aria-label="Java logo"');
  expect(markup).toContain('aria-label="Docker logo"');
  expect(markup).toContain('aria-label="System Design practice mark"');
  expect(markup).not.toContain('>01 /<');
});
