import { describe, expect, it } from 'vitest';
import { portfolioData } from '../app/data';

describe('approved 2026 CV content', () => {
  it('exposes the approved profile and public contact channels', () => {
    expect(portfolioData.hero).toMatchObject({
      name: 'Charly Micolas Butarbutar',
      role: 'Senior Software Engineer | Backend Engineering | Technical Leadership',
    });
    expect(portfolioData.hero.tagline).toContain('approximately 9 years');
    expect(portfolioData.contact).toEqual({
      email: 'charlymicolasbutar@gmail.com',
      linkedin: 'https://linkedin.com/in/charly-micolas',
      github: 'https://github.com/charlybutar21',
    });
    expect(portfolioData.contact).not.toHaveProperty('phone');
  });

  it('preserves the approved competencies, skills, and employment order', () => {
    expect(portfolioData.coreCompetencies).toEqual([
      'Backend Architecture',
      'API Design and Integration',
      'Microservices',
      'Distributed Systems',
      'Database Design',
      'System Reliability',
      'Technical Leadership',
      'Delivery Management',
      'Requirement Analysis',
      'Stakeholder Alignment',
      'Code and Design Review',
      'Agile Delivery',
    ]);
    expect(portfolioData.skills.map(({ category }) => category)).toEqual([
      'Languages',
      'Frameworks & Libraries',
      'Data & Messaging',
      'Development & DevOps',
      'Architecture & Engineering Practices',
      'Project Management',
    ]);
    expect(portfolioData.experience).toHaveLength(6);
    expect(portfolioData.experience[0]).toMatchObject({
      company: 'PT Progo Puncak Group (Pinjamin)',
      period: 'Jun 2024 - Present',
      location: 'South Jakarta',
    });
  });
});
